Add-Type -AssemblyName System.Drawing
$src = "c:\Users\Lenovo\Desktop\Expense tracker\public\pwa-512x512.png"
$img = [System.Drawing.Image]::FromFile($src)

$bmp512 = New-Object System.Drawing.Bitmap(512, 512)
$g512 = [System.Drawing.Graphics]::FromImage($bmp512)
$g512.DrawImage($img, 0, 0, 512, 512)
$bmp512.Save("c:\Users\Lenovo\Desktop\Expense tracker\public\pwa-512x512-new.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp512.Dispose()
$g512.Dispose()

$bmp192 = New-Object System.Drawing.Bitmap(192, 192)
$g192 = [System.Drawing.Graphics]::FromImage($bmp192)
$g192.DrawImage($img, 0, 0, 192, 192)
$bmp192.Save("c:\Users\Lenovo\Desktop\Expense tracker\public\pwa-192x192-new.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp192.Dispose()
$g192.Dispose()

$img.Dispose()

Move-Item -Force "c:\Users\Lenovo\Desktop\Expense tracker\public\pwa-512x512-new.png" "c:\Users\Lenovo\Desktop\Expense tracker\public\pwa-512x512.png"
Move-Item -Force "c:\Users\Lenovo\Desktop\Expense tracker\public\pwa-192x192-new.png" "c:\Users\Lenovo\Desktop\Expense tracker\public\pwa-192x192.png"
