fx_version 'cerulean'
game 'gta5'

-- Metadata Sumber Daya
author 'Your Name'
description 'Cakep Speedometer NUI Final'
version '1.0.0'

-- 1. Tentukan halaman NUI
ui_page 'index.html'

-- 2. Daftarkan file-file NUI
files {
    'index.html',
    'style.css',
    'script.js'
}

-- 3. Tentukan skrip yang berjalan di sisi Client (Game)
client_scripts {
    'client.lua'
}
