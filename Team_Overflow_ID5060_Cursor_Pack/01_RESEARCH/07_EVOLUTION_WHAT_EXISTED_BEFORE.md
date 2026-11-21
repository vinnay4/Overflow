# Evolution of the fix ("Ask what existed before": course deck 05, Practice 6)

| Era | What existed | Need it met | How | Constraint that shaped it | Source / status |
|---|---|---|---|---|---|
| Traditional | Watch the pot, blow on the foam, lower the flame, stir | Save milk | Human sensor + heat-flux control | No other sensor available | Common practice (our deck obs. 4) |
| Traditional | Wooden spoon across the pot, butter on the rim | Delay foam | Cool, porous surface; fat antifoam | Uses what is in the kitchen | [R2][R22][R17] |
| 1938, England | **Milk watcher** (glass/ceramic disc) | Stop boil-over + audible alert | Merges bubbles, breaks skin, rattles | Mass-produced glass/ceramic; milk boiled daily | [R19] (date sourced); motivation = *hypothesis* |
| 20th c., India | **Double-walled whistling milk boiler** | Boil milk without scorching or spilling | Water jacket caps wall temperature; whistle | Daily boiling of raw/packaged milk | [R24] vendor descriptions; dates not verified |
| 1984 | Sensor touching the rising milk surface switches off heat (DE3435441A1) | Automatic cut-off | Contact sensor | Electric stoves | [R27] |
| 2010–2011 | Capacitive boil-over detection around induction coils (Panasonic; WO2010129715) | Stop the hob after a spill | Liquid on the glass changes capacitance | Induction glass tops, electronics | [R25][R26] |
| 2010s | Silicone anti-boil-over lids (Kochblume) | Contain foam | Petals vent and drain back | Food-grade silicone | [R23] |
| 2020s | Bosch PerfectCook pan sensor; Samsung smart hood patent (camera, thermal, audio) | Monitor boiling | Sensors + algorithms | Connected appliances | [R28][R30] |
| 2026 | Samsung, LG, Cuckoo AI induction: **vibration or sound detection of boiling → automatic power cut** | Unattended cooking | ML on sensor data | Premium appliances only | [R29] |
| **Ours, 2026** | **Ubaal: phone microphone + pre-boil acoustic cue** | Unattended boiling on *any* stove, ₹0 | Change Frame: the phone is the sensor | No budget, no hardware, placements | this project |

**Pattern (a talking point for slide 2):** the history moves from *attacking the foam* (spoon, disc, lid) to *adding a sensor that closes the loop earlier* (whistle, capacitance, sound/vibration). Our rebuild follows that trend at zero cost.
