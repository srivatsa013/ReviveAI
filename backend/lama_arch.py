import torch
import torch.nn as nn
import torch.nn.functional as F


class FourierUnit(nn.Module):
    def __init__(self, in_channels, out_channels):
        super().__init__()
        self.conv = nn.Conv2d(in_channels * 2, out_channels * 2, 1)
        self.bn = nn.BatchNorm2d(out_channels * 2)

    def forward(self, x):
        b, c, h, w = x.shape
        ffted = torch.fft.rfftn(x, dim=(-2, -1), norm='ortho')
        ffted = torch.stack([ffted.real, ffted.imag], dim=-1)
        ffted = ffted.reshape(b, c * 2, ffted.shape[2], ffted.shape[3])
        ffted = F.relu(self.bn(self.conv(ffted)))
        ffted = ffted.reshape(b, 2, c, ffted.shape[2], ffted.shape[3])
        ffted = torch.complex(ffted[:, 0], ffted[:, 1])
        output = torch.fft.irfftn(ffted, s=(h, w), dim=(-2, -1), norm='ortho')
        return output


class FFCBlock(nn.Module):
    def __init__(self, channels):
        super().__init__()
        self.local_conv = nn.Conv2d(channels, channels, 3, padding=1)
        self.global_conv = FourierUnit(channels, channels)
        self.bn = nn.BatchNorm2d(channels)
        self.relu = nn.ReLU(inplace=True)

    def forward(self, x):
        local_out  = self.local_conv(x)
        global_out = self.global_conv(x)
        return self.relu(self.bn(local_out + global_out))


class LaMaFFC(nn.Module):
    def __init__(self):
        super().__init__()
        self.encoder = nn.Sequential(
            nn.Conv2d(4, 64, 3, padding=1),   # 4 = RGB + mask
            nn.ReLU(inplace=True),
            nn.Conv2d(64, 128, 3, stride=2, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(128, 256, 3, stride=2, padding=1),
            nn.ReLU(inplace=True),
        )
        self.middle = nn.Sequential(*[FFCBlock(256) for _ in range(6)])
        self.decoder = nn.Sequential(
            nn.ConvTranspose2d(256, 128, 4, stride=2, padding=1),
            nn.ReLU(inplace=True),
            nn.ConvTranspose2d(128, 64, 4, stride=2, padding=1),
            nn.ReLU(inplace=True),
            nn.Conv2d(64, 3, 3, padding=1),
            nn.Sigmoid()
        )

    def forward(self, img, mask):
        x = torch.cat([img, mask], dim=1)
        x = self.encoder(x)
        x = self.middle(x)
        x = self.decoder(x)
        # Only replace masked regions
        return img * (1 - mask) + x * mask