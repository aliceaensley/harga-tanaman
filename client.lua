-- FiveM Client-Side Lua Script
Citizen.CreateThread(function()
    while true do
        -- Update setiap 50 milidetik (20 FPS)
        Citizen.Wait(50) 
        
        local playerPed = PlayerPedId()
        local inVehicle = IsPedInAnyVehicle(playerPed, false)

        if inVehicle then
            local vehicle = GetVehiclePedIsIn(playerPed, false)
            
            -- Mendapatkan Data dari Game menggunakan FiveM Natives
            local speed_mps = GetEntitySpeed(vehicle)
            local speed_kmh = math.floor(speed_mps * 3.6) -- Konversi ke KM/H
            local rpm = GetVehicleCurrentRpm(vehicle)      -- RPM (0.0 sampai 1.0)
            local gear = GetVehicleCurrentGear(vehicle)    -- Gear saat ini
            local fuel = math.floor(GetVehicleFuelLevel(vehicle)) -- Fuel level (0-100)
            -- Engine Health normalnya 1000, dibagi 10 untuk 0-100%
            local engineHealth = math.floor(GetVehicleEngineHealth(vehicle) / 10) 

            -- Mengirim Data ke NUI melalui Event
            SendNUIMessage({
                type = 'updateSpeedometer',
                inVehicle = true,
                speed = speed_kmh,
                rpm = rpm, 
                gear = gear,
                fuel = fuel,
                engineHealth = engineHealth,
            })
        else
            -- Sembunyikan HUD
            SendNUIMessage({
                type = 'updateSpeedometer',
                inVehicle = false,
                -- Data tetap dikirim agar JS bisa menerima inVehicle=false
            })
        end
    end
end)
