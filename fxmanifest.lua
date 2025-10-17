fx_version 'cerulean'
game 'gta5'

-- Metadata Sumber Daya
author 'Your Name'
description 'External Speedometer Loader'
version '1.0.0'

-- BAGIAN PENTING: Menggunakan URL EKSTERNAL
-- FiveM akan memuat halaman ini di dalam antarmuka NUI.
ui_page 'https://agroventura.site/speedo/'

-- Halaman NUI ini tidak memerlukan file lokal karena dimuat dari internet.
-- Jadi, tidak ada bagian 'files {}'

-- JEMBATAN KOMUNIKASI WAJIB:
client_scripts {
    'client.lua'
}
