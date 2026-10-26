# ArcPort Home 22 — User & Installation Manual

**Nordvane Energy** · *Power that moves with you*

**Model:** NV-AP22 (with display) · NV-AP22-NS (no display)
**Document revision:** 10 — October 2026
**Language:** English
**Firmware covered:** v3.2 and later · **NordLink app:** v4.1 and later · **Nexus Hub:** OS 2.6 and later

> Nordvane Energy is a fictional company. This manual was written as an example document and the product described does not exist.

---

## Table of Contents

1. Safety Instructions
2. Description and Features
   - 2.1 Description
   - 2.2 Features
   - 2.3 Operating modes
   - 2.4 What's in the box
   - 2.5 Product overview and connections
3. Installation
   - 3.1 Before you begin
   - 3.2 Site and mounting requirements
   - 3.3 Electrical requirements
   - 3.4 Step-by-step installation
   - 3.5 Wiring diagrams
   - 3.6 Post-installation checklist
4. System Examples
5. Setup, Configuration and Operation
   - 5.1 First-use setup via NordLink (Bluetooth)
   - 5.2 First-use setup via Wi-Fi access point
   - 5.3 Pairing with a Nexus Hub
   - 5.4 Nexus Hub setup and options
   - 5.5 NordLink app reference
   - 5.6 Touchscreen reference
   - 5.7 Firmware updates
   - 5.8 Reset and password recovery
   - 5.9 Maintenance and cleaning
6. Troubleshooting
   - 6.1 Vehicle detection and signal calibration
   - 6.2 Hub pairing problems
   - 6.3 Wi-Fi problems
   - 6.4 Frequently asked questions
   - 6.5 Codes: errors, warnings and notices
   - 6.6 Common user errors and how to avoid them
   - 6.7 Overheating and thermal management
   - 6.8 Symbolic code map
   - 6.9 Overheating quick reference (E_OVERHEAT_WARN, E_OVERHEAT_TRIP)
   - 6.10 Other common issues with the charging point
7. Technical Specification
   - 7.1 Dimensions
8. Appendix
   - 8.1 Grid-operator load control (dry-contact input)
   - 8.2 Modbus TCP integration
   - 8.3 Web interface reference
   - 8.4 Light ring status reference
9. Warranty, Support and Disposal
10. Glossary
11. Revision History

**Part II — Technical Service Manual**

12. Service Requirements, Tools and Safe Working
13. Internal Architecture and Test Points
14. Diagnostic Method and Data Sources
15. Error Code Repair Procedures (E-01 to E-09)
16. Warning and Notice Procedures (W-201 to W-214, N-401 to N-408)
17. Symptom-Based Troubleshooting (incl. 17.11 Overheating diagnosis)
18. Reference Measurements and Expected Values
19. Commissioning and Periodic Inspection Test Procedure
20. Component Replacement Procedures
21. Diagnostic Log and Event Code Reference
22. Service Record Templates

---

# 1. Safety Instructions

Read all safety instructions before installing or using the ArcPort Home 22. Failure to follow them can result in fire, electric shock, serious injury or damage to equipment.

**Qualified personnel only.** Installation, adjustment and internal servicing must be carried out by a licensed electrician or equivalent qualified person. Do not perform any servicing other than that described in this manual unless you are qualified to do so.

**Follow local rules.** All electrical work must comply with the wiring regulations of the country of installation and with the instructions in this manual. Where this manual and local regulations differ, local regulations take priority.

**Intended use.** The ArcPort Home 22 is designed for charging road electric vehicles that use an IEC 62196 Type 2 connector. Use it only for that purpose and only within the specified operating parameters.

## Warnings and cautions

> ⚠️ **WARNING — risk of electric shock, fire and injury**

- Never install near fire sources, explosive materials, combustible materials, or in locations where gas or chemical explosions could occur.
- The unit must be connected to protective earth at all times. If earth is missing, the unit will refuse to charge.
- Isolate the supply and verify it is dead before installing or opening the unit.
- Supervise children near the equipment. This product is not a toy.
- Do not insert fingers, tools or metal objects into the vehicle socket or any opening in the housing.
- Do not use the station if the housing is cracked, the socket is damaged, the supply cable is damaged, or the unit behaves abnormally.
- Do not use adapters, extension cords or cable reels between the station and the vehicle unless approved by the vehicle manufacturer and compliant with local regulations.
- Do not apply strong force to the housing, socket or display. Do not use sharp objects on the product.
- Do not open, disassemble or modify the unit unless you are a qualified installer following this manual. Unauthorised modification voids the warranty.
- Do not touch live electrical parts. Several areas inside the unit carry mains voltage even when the station is idle.
- Do not allow the vehicle cable to lie in standing water or snow, and do not charge if the connector or socket is wet or iced over.
- Ensure the earth connection is correct to prevent damage to the equipment and the vehicle.
- Transport the unit in its original packaging to avoid damage.
- Store the unit in a dry place between –40 °C and +80 °C.
- Do not operate the unit outside its operating range of –25 °C to +50 °C.
- Wireless emissions from this device could potentially affect certain medical electronic implants. People with implants should consult the implant manufacturer before using or standing close to the station.

## Symbols used in this manual

| Symbol | Meaning |
|---|---|
| ⚠️ | Warning: risk of injury or serious damage |
| ℹ️ | Note: useful information |
| 💡 | Tip: a faster or better way of doing something |
| 🔧 | Installer: procedure for qualified personnel only |

---

# 2. Description and Features

## 2.1 Description

The ArcPort Home 22 is an AC charging station for electric vehicles. It delivers up to **22 kW** in three-phase installations or **7.4 kW** in single-phase installations, with a configurable charging current of **6–32 A** per phase.

The station connects to your home network via Wi-Fi and can be operated in several ways:

- Locally, with the built-in 4.3-inch colour touchscreen
- Locally over Bluetooth, with the **NordLink** mobile app
- From any browser on your network, using the built-in web interface
- Through a **Nexus Hub** energy gateway
- From anywhere in the world, through the **NordCloud** portal and the NordLink Remote function

When your home has solar panels and a Nexus Hub, the ArcPort can charge your vehicle using only surplus solar energy, so power that would otherwise be sold back to the grid at a low tariff is stored in your vehicle's battery instead.

A programmable **Halo light ring** around the socket shows the charging status from a distance, with 48 selectable light effects. The impact-resistant, UV-stabilised polycarbonate housing is rated IP54 and can be mounted indoors or outdoors.

## 2.2 Features

- Three-phase 22 kW or single-phase 7.4 kW charging
- Configurable current from 6 A to 32 A
- 4.3-inch colour touchscreen with a lock function
- Wi-Fi (802.11 b/g/n, 2.4 GHz) and Bluetooth Low Energy
- Built-in web interface
- MQTT and Modbus TCP support for integration with energy-management systems
- Solar-surplus charging with Nexus Hub
- Time-based scheduling with up to 12 schedules
- Session statistics: energy, duration, cost and solar savings
- Integrated DC 6 mA residual-current detection (an upstream type A RCD is still required — see Section 3.3)
- Welded-contactor detection, earth-presence detection and control-pilot short-circuit detection
- Over-the-air firmware updates via NordCloud
- Halo light ring with 48 light effects and per-state configuration
- Dry-contact input for grid-operator load reduction
- Operating temperature range from –25 °C to +50 °C

## 2.3 Operating modes

The ArcPort Home 22 has three operating modes.

### Solar mode

In Solar mode the station monitors the energy flow of your house through the Nexus Hub. It starts charging when your solar system produces more energy than the house is using, and adjusts the charging current as the surplus rises and falls.

> ℹ️ Solar mode requires a Nexus Hub in the system, and communication between the Hub and the ArcPort must be enabled. See Sections 5.3 and 5.4.

**How does it work?**

Charging starts automatically when the vehicle is connected and all of the following are true:

1. The home battery's state of charge is above the value set in **Start charging at battery SoC (%)**. If you do not have a home battery, this condition is ignored.
2. There is enough surplus solar power. Surplus is calculated as:

   *Surplus = total solar production − household loads (excluding the vehicle)*

   For example, with the minimum charging current set to 6 A on a 230 V phase, you need at least **1,380 W** of surplus (230 V × 6 A). If you raise the minimum charging current, the required surplus rises accordingly.

3. Alternatively, if surplus is below the minimum, you can enable **Top up from grid in Solar mode**. The ArcPort then draws the missing power from the grid so the vehicle can charge at the minimum current.

**Example:** With only 800 W of surplus and a 6 A minimum, 580 W is drawn from the grid to reach the required 1,380 W.

> 💡 Enable **Smooth-start hold** to reduce the number of start/stop cycles on days with passing clouds. The station will continue charging at the minimum current for a configurable time when the surplus briefly drops.

### Manual mode

In Manual mode you choose the charging current between 6 A and the configured maximum. Charging starts and stops on your command, regardless of solar production. You can control Manual mode from:

- The touchscreen slider
- The web interface
- The NordLink app (Bluetooth or Remote)
- The Nexus Hub touchscreen or its remote console
- The NordCloud dashboard

### Scheduled mode

Scheduled mode lets you charge at specific times, for example overnight when electricity is cheaper. Each schedule has a start time, end time, maximum current and repeat pattern. The station follows the schedules automatically. Up to 12 schedules can be stored.

## 2.4 What's in the box

- 1 × ArcPort Home 22 charging station
- 1 × 25 mm nylon cable gland (cable diameter 10–18 mm), pre-fitted
- 1 × Wall-mounting template (paper)
- 4 × Wall plugs (8 mm) and 4 × stainless-steel screws (5 × 50 mm)
- 1 × Torx T20 security driver bit
- 1 × Quick start guide

> ℹ️ A charging cable is not included. The ArcPort has a Type 2 **socket** and requires a Mode 3 charging cable (Type 2 to the vehicle's connector).

## 2.5 Product overview and connections

**Front**

1. Halo light ring
2. Type 2 vehicle socket with spring-loaded cover
3. 4.3-inch touchscreen
4. Model label

**Underside**

5. Mains cable gland
6. Optional second gland knock-out (for the dry-contact cable)

**Inside (behind the backing plate)**

7. Mains terminals (L1, L2, L3, N, PE)
8. Dry-contact input terminals
9. Information label with model, serial number, Wi-Fi password and Bluetooth pairing code
10. DEF button (reset)
11. Status LEDs

---

# 3. Installation

> 🔧 This product may only be installed by a licensed electrician.

## 3.1 Before you begin

- Make sure you have the latest version of this manual. It is available at **docs.nordvane.example/arcport**.
- Check the unit for transport damage. Do not install a damaged unit.
- Confirm that your mains supply and distribution board can support the charging power you intend to use (see 3.3).
- Obtain any permits or grid-operator approvals that apply in your country.

## 3.2 Site and mounting requirements

- The unit can be mounted on a wall or a pole. The mounting surface must be **solid, flat and vertical**.
- Mount the station so that the socket is between **0.9 m and 1.5 m** above the ground, unless local regulations specify otherwise.
- Allow at least **200 mm** of free space on each side and **300 mm** below the unit for cable routing.
- Avoid direct, prolonged sunlight where possible. A shaded position reduces the chance of thermal derating in hot climates.
- Keep the station away from sources of heat, steam and corrosive vapour.
- Choose a location within reach of your vehicle's charging port, taking into account the length of your charging cable.
- Make sure the Wi-Fi signal at the mounting location is adequate. An RSSI better than **–70 dBm** is recommended. You can test with a smartphone beforehand.
- In coastal or industrial atmospheres, consult your installer about additional protection.

## 3.3 Electrical requirements

> ⚠️ Incorrect electrical protection is the most common cause of installation faults. Read this section carefully.

- **Supply protection:** protect the AC supply line with a circuit breaker or fuse rated at **40 A or less** per phase. Size the cable accordingly. If the supply is rated lower, the breaker must be sized to match.
- **Residual-current protection:** an **external RCD is required**. We recommend a **type B** RCD (or type A combined with an external 6 mA DC detection device, where permitted by local regulations). Match the RCD rating to the maximum charging power used: a 40 A RCD for regular 22 kW charging, or a correspondingly lower rating if you limit the station's charging current.
- **Dedicated circuit:** the station must be supplied by its own dedicated circuit.
- **Recommended cable cross-section:** **6 mm²** (AWG 10). Larger cross-sections may be required for long cable runs; the terminals accept 4–10 mm².
- **Earthing:** a reliable protective earth connection is mandatory. Where the supply uses a PME (TN-C-S) arrangement, follow local regulations on earth-electrode and open-PEN protection.
- **Supply voltage:** 230 V single-phase or 400 V three-phase, 50 Hz. Operating range is 170–265 V per phase.
- **Overvoltage protection:** a surge protective device (SPD) in the distribution board is recommended, particularly in areas with frequent lightning.

| Charging power | Supply | Recommended breaker | Recommended RCD |
|---|---|---|---|
| 22 kW | 3-phase, 32 A | 32–40 A | 40 A type B |
| 11 kW | 3-phase, 16 A | 16–20 A | 25 A type B |
| 7.4 kW | 1-phase, 32 A | 32–40 A | 40 A type B |
| 3.7 kW | 1-phase, 16 A | 16–20 A | 25 A type B |

> ℹ️ Tip: Setting the maximum charging current in software to match your supply is a good way of protecting the installation. See Step 3 of 3 in Section 5.1.

**Information label.** Inside the unit you will find a label with the model, serial number, **Wi-Fi/web password**, and (depending on manufacture date) the unique **Bluetooth pairing code**. Photograph this label or write down the details for future reference. The initial password is used both for the web interface and for the station's Wi-Fi access point.

## 3.4 Step-by-step installation

**Tightening torque for the backing-plate screws: 1.0–1.2 Nm.**

1. Switch off and lock out the supply circuit. Verify with a voltage tester that it is dead.
2. Unscrew the 8 Torx screws and remove the black backing plate.
3. Hold the backing plate (or the supplied paper template) against the wall at the intended height, level it, and mark the 4 fixing holes.
4. Drill the 4 holes, insert the wall plugs, and set the template aside.
5. If the supply cable enters from inside the building, mark and drill a cable passage through the wall. Seal the passage afterwards to keep out moisture and insects.
6. Label each conductor of the supply cable (L1, L2, L3, N, PE) for identification.
7. Pass the cable through the wall (if applicable), through the nylon gland, through the grommet, and into the station.
8. Strip the conductors and terminate each with a **ferrule**.
9. Connect the conductors to the mains terminals:
   - **Three-phase:** L1, L2, L3, N, PE
   - **Single-phase:** L1, N, PE only. Leave L2 and L3 unconnected.
10. Tighten each terminal screw to the torque stated on the terminal label, and give each conductor a gentle pull test.
11. If you are using the dry-contact input (Appendix 8.1), connect it now using the second gland.
12. Tighten the gland nut around the cable so that the cable is gripped firmly and the seal is tight.
13. Refit the backing plate and tighten the 8 screws to 1.0–1.2 Nm. Check that the seal is correctly seated all the way round.
14. Mount the station on the wall using the 4 screws.
15. Restore power. The Halo ring will pulse white and the display will show the first-setup QR code.

> ⚠️ Do not leave the backing plate off while the unit is powered, except when performing the DEF-button procedure described in Section 5.8.

> ⚠️ **Single-phase installations:** do not install the station on one phase of a three-phase system and leave the others unconnected without informing your grid operator. Some countries restrict single-phase loads above a certain current.

## 3.5 Wiring diagrams

**Three-phase connection (TN-S / TT)**

```
 Distribution board                             ArcPort Home 22
 ┌─────────────────────┐                      ┌───────────────────┐
 │  3P+N Breaker 40 A  │─ L1 ────────────────▶│ L1                │
 │  Type B RCD  40 A   │─ L2 ────────────────▶│ L2                │
 │                     │─ L3 ────────────────▶│ L3                │
 │                     │─ N  ────────────────▶│ N                 │
 │  Earth bar          │─ PE ────────────────▶│ PE                │
 └─────────────────────┘                      └───────────────────┘
```

**Single-phase connection**

```
 Distribution board                             ArcPort Home 22
 ┌─────────────────────┐                      ┌───────────────────┐
 │  1P+N Breaker 40 A  │─ L1 ────────────────▶│ L1                │
 │  Type B RCD  40 A   │─ N  ────────────────▶│ N                 │
 │  Earth bar          │─ PE ────────────────▶│ PE                │
 └─────────────────────┘                      │ L2, L3: not used  │
                                              └───────────────────┘
```

## 3.6 Post-installation checklist

Before handing the installation to the customer, confirm the following:

- [ ] Supply isolated and verified dead before work began
- [ ] Breaker and RCD correctly rated and tested
- [ ] Earth continuity and earth-loop impedance measured and recorded
- [ ] Phase sequence and polarity correct (three-phase)
- [ ] Gland tight, backing-plate seal intact, all 8 screws torqued
- [ ] Wi-Fi password and Bluetooth pairing code recorded
- [ ] First setup completed (Section 5.1 or 5.2)
- [ ] Maximum current set to match the supply
- [ ] Test charge performed with a vehicle
- [ ] Customer shown the touchscreen, the NordLink app and the light ring

---

# 4. System Examples

The ArcPort Home 22 fits a wide range of installations. The two most common are described below.

## 4.1 Grid-connected house with solar and a Nexus Hub

```
   ☀ Solar array ──▶ Solar inverter ──┐
                                      ▼
   Grid ──▶ Meter ──▶ Main board ──▶ House loads
                         │
                         ├──▶ [RCD B 40 A] ──▶ ArcPort Home 22 ──▶ 🚗
                         │
                         └──▶ Nexus Hub  (reads energy flows, coordinates charging)
                                 ▲
                                 └─ Wi-Fi / Ethernet to ArcPort and NordCloud
```

In this system the Nexus Hub measures production and consumption, and tells the ArcPort how much surplus is available. The ArcPort adjusts its current accordingly.

## 4.2 Off-grid or backup system with battery

In an off-grid or backup system, the ArcPort can be fed from the output side of an inverter/charger. Set **Charger position** to *Inverter output* so that the station knows its power comes from the inverter and not from the grid.

> ℹ️ In systems without a physical home battery, enable **Virtual battery** in the Hub settings so that Solar mode can still run. See Section 5.5.

## 4.3 Key to the system diagram

| Key | Description |
|---|---|
| A | Solar array |
| B | Solar inverter (grid-feed) |
| C | Mobile device with the NordLink app (setup over Wi-Fi or Bluetooth) |
| D | ArcPort Home 22 installed on the mains side of an inverter/charger |
| E | Inverter/charger (single-phase or three-phase) |
| F | ArcPort Home 22 installed on the output side of an inverter/charger |
| G | Home battery |
| H | Nexus Hub |
| I | Dedicated RCD, type B, 40 A for 22 kW charging |

Multiple ArcPort stations can be installed in the same system. Available power is shared between them according to a first-come-first-served rule, or equally, depending on the Hub's **Load-sharing** setting.

---

# 5. Setup, Configuration and Operation

> ℹ️ A new ArcPort must go through **first-use setup** before it can charge. The same setup is required after a full factory reset.

You can complete first-use setup in either of two ways:

- **5.1** — with the NordLink app over Bluetooth (fastest for most users)
- **5.2** — through the station's own Wi-Fi access point and a web browser

> ℹ️ Bluetooth is **disabled** on units shipped with firmware 1.9 or earlier. For those units, complete Section 5.2 first and then enable Bluetooth in the web interface's *Network* menu. Units shipped with firmware 2.0 or later have Bluetooth enabled by default.

## 5.1 First-use setup via NordLink (Bluetooth)

### Preparation

1. Install **NordLink** from the App Store or Google Play and open it.
2. Find your station in the device list. It appears as **ARCP-NV-xxxxxxxx**.
3. Tap the station. The pairing dialogue starts. Enter the pairing code, which is either **000000** or the unique code printed on the label inside the housing.

### Start initial setup

If pairing succeeds, the status page appears. A warning, **W-201: Initial setup not completed**, will be displayed. Tap the cog-wheel icon in the top right to open Settings and begin.

### Step 1 of 3 — Configure Wi-Fi access

You must choose one of the following to continue:

- **Access Point (AP) mode.** The station creates its own Wi-Fi network. All fields are pre-filled; the AP passphrase is the password printed on the internal label. Choose this if you have no home Wi-Fi at the installation location or no Nexus Hub.
- **Station mode.** The station joins your home Wi-Fi network. Type the network name (SSID) and password, or tap **Scan** to select a nearby network from a list and enter its password.

> ⚠️ The ArcPort supports **2.4 GHz** Wi-Fi only (802.11 b/g/n). It cannot join a 5 GHz-only network.

### Step 2 of 3 — Change web-access credentials

This step protects access to the web interface. The default user name is **admin** and the default password is the one printed on the internal label. Choose your own user name and a strong password.

### Step 3 of 3 — Set the maximum charging current

Choose the highest current the station is allowed to deliver (range **6–32 A**). Set this value in line with your supply and breaker. See Section 3.3.

### Setup complete

You are returned to the status page and the setup warning disappears. The ArcPort is now ready for use.

## 5.2 First-use setup via Wi-Fi access point

When powered for the first time, the station broadcasts its own Wi-Fi network.

### Connect to the access point

Use any one of these methods:

1. Scan the QR code on the internal label.
2. Open the Wi-Fi settings on your phone or laptop, and choose the network **ARCP-NV-xxxxxxxx**. The password is printed on the internal label.
3. Scan the QR code shown on the touchscreen during first setup.

> ℹ️ After first setup is complete, the QR code on the display changes to a link to the Nordvane support site.

### Web-based setup wizard

Open a browser and go to **http://192.168.4.1**. Log in with user **admin** and the password from the label. The setup wizard starts.

**Step 1 — Location.** Choose your region, country and time zone. Daylight-saving changes are applied automatically.

**Step 2 — Off-peak charging.** In some regions, regulations or utility programmes require new charging stations to avoid charging during certain peak periods by default. If your chosen location requires this, the wizard will show an **Off-peak charging** option, already enabled. You can turn it off now or later.

**Step 3 — Wi-Fi.** Choose how the station connects to a network.

- *Access point mode:* the unit creates its own network. This is intended for setup or for installations without a Nexus Hub. You can change the SSID, password, IP address and netmask.
- *Station mode:* the unit joins your existing Wi-Fi, which should also include your Nexus Hub if you have one.
  1. Switch the Wi-Fi mode from AP to **Station**.
  2. Click **Scan** to search for networks, or click **Add** to type a known network by hand.
  3. Tick your network and click **Apply**.
  4. Type your Wi-Fi password and click **Next**.
  5. If you need a fixed IP address instead of DHCP, change **IP mode** to *Manual* and complete the IP address, mask, gateway and DNS fields.

**Step 4 — Access.** Choose your own user name and a new password. The password must contain at least 8 characters with a mix of lower-case, upper-case and special characters.

**Step 5 — Charging current.** Enter the maximum charging current (6–32 A).

**Step 6 — Finish.** Click **Save**. The station restarts. When it comes back, log in with the credentials you just created. The dashboard will appear and the ArcPort is ready.

## 5.3 Pairing with a Nexus Hub

Pairing is recommended if you want Solar mode, remote access through NordCloud, or integration with other energy-management features. The ArcPort and the Hub use **MQTT** for communication. Modbus TCP is still available as an alternative (see Appendix 8.2).

> ℹ️ **Version requirements:** ArcPort firmware 3.0 or later · Nexus Hub OS 2.6 or later · NordLink app 4.1 or later.

The two devices must be **on the same network and subnet**. The Hub must first be placed in pairing mode, where it listens for a request from the ArcPort.

### 5.3.1 Put the Hub into pairing mode

1. On the Hub's touchscreen or web interface, go to **Settings → Integrations → Paired Devices**.
2. Tap **Start pairing**. A countdown shows the time remaining (**2 minutes**).
3. If the time runs out, tap **Start pairing** again.

Some Hub models also have a physical button. Double-press it with a pointed object; the blue LED flashes steadily while pairing is active.

### 5.3.2 Pair using the ArcPort web interface

1. Log in to the ArcPort web interface and go to **General → Hub**.
2. Set **Communication** to *Enabled*.
3. Set **Communication type** to *MQTT*.
4. Click **Discover**. A list of Hubs found on your network appears.
5. Click the Hub you want to use. Its IP address and Portal ID are filled in automatically.
6. Check that Hub pairing mode is still active, then click **Pair**.
7. A confirmation message appears. Click **Save** at the bottom of the page.

The ArcPort now appears in the Hub's device list and on its overview screen.

### 5.3.3 Pair using NordLink

1. Connect to the ArcPort with NordLink.
2. Go to **Settings → General → Hub**.
3. Turn **Enable communication** on and set **Communication type** to *MQTT*.
4. Tap **Discover** and select your Hub from the list.
5. Make sure Hub pairing mode is still active, then tap **Pair**.
6. The status changes to **Communication established** in green.

> 💡 If discovery finds nothing, type the Hub's IP address and Portal ID by hand. Some routers block the mDNS packets that discovery relies on.

## 5.4 Nexus Hub setup and options

Once paired, the ArcPort appears in the Hub's device list, showing its mode and status.

**Charging Station page.** Shows the current session with power per phase, energy and duration. From here you can change the charge mode, set the current for the active mode, and enable or disable charging.

**Setup menu.**

- **Position:** where the station is wired in the system (*Grid side* or *Inverter output*).
- **Autostart:** begin charging as soon as a vehicle is plugged in.

> ℹ️ *Enable charging* does not mean the vehicle will start charging immediately. It means the station is ready to charge when conditions allow, for example when a schedule becomes active.

**Device page.** Shows connection details, product ID, firmware version, serial number and the station's name, which you can change.

## 5.5 NordLink app reference

### 5.5.1 Connecting

1. Make sure Bluetooth is enabled on both your phone and the ArcPort.
2. Open NordLink and tap the station in the list.
3. Enter the pairing code when requested.
4. The overview page appears.

### 5.5.2 Overview page

The overview page shows charging state, charging controls, live values and session statistics.

**Controls**

- **Start/Stop** — start or stop charging in Manual mode. After you press Stop, the current is first reduced to the minimum and the contactor opens after about 2 seconds.
- **Charging mode** — switch between *Manual*, *Solar* and *Scheduled*.
- **Charging current** — set the current (6–32 A, within the minimum and maximum set in General settings). In Scheduled mode this is disabled because the schedule defines it.

**Live values**

- **Power** — the total power for all phases.

**Session statistics**

- **Session time** — duration of the current session
- **Session energy** — energy delivered in this session
- **Session cost** — the cost of grid energy used, based on your energy price
- **Session solar savings** — money saved by energy supplied from solar
- **Lifetime energy** — total energy delivered since installation

### 5.5.3 Settings page

Tap the cog wheel to open Settings, which contains: **Network**, **General**, **Scheduler**, **Light Ring** and **Access**.

The three-dot menu at the top right provides:

- **Import settings** — load previously saved settings from a file
- **Save settings** — save the current settings to a file, for backup or to copy to another station
- **Share settings** — send the file by email or message
- **Product info** — model, serial number, name, firmware version and Bluetooth switch
- **Reset to defaults** — return all settings to factory defaults

### 5.5.4 Product info

- **Product** — name and model number
- **Serial number**
- **Pairing code** — hidden by default; tap *Change* to set a new one
- **Custom name** — a friendly name for the station
- **Firmware** — the installed firmware version
- **Bluetooth** — enable or disable Bluetooth

> ⚠️ If you disable Bluetooth in NordLink, you can only re-enable it from the web interface's *Network* menu, or by performing a factory reset.

### 5.5.5 Network settings

**Network information**

- **Current status** — the status of the network connection
- **Connected to** — the Wi-Fi network in use
- **IP address** — the station's address on your network

**Wi-Fi settings**

- **Mode** — *Use local Wi-Fi* or *Create access point*. Use access-point mode only if there is no other Wi-Fi network.
- **IP configuration** — *Automatic (DHCP)* is recommended. Manual configuration is for advanced networks.
- **Scan period** — how often the station scans for networks in the background. Set to *Disabled* if you only ever use one network.

**Known Wi-Fi networks**

The network currently in use is shown in green with **Forget** and **Disable** buttons. Use **Add manually** for hidden networks, or **Scan** to list nearby networks.

> ℹ️ In Station mode the ArcPort is designed for standards-compliant, correctly managed networks. Use a router or access point that meets local radio-equipment regulations.

### 5.5.6 General settings

**Charging settings**

| Setting | Description |
|---|---|
| **Charger position** | Where the station is wired: before an inverter (grid side) or after it (inverter output). |
| **Autostart** | Begin charging automatically when the vehicle is connected. Disable it to prevent unauthorised use. |
| **Keep contactor closed when charged** | If enabled, the contactor stays closed after charging is complete. Useful for pre-conditioning the cabin from mains power. Some vehicles report an error in this state. |
| **Maximum charging current** | The highest current the station will ever deliver (6–32 A). |
| **Minimum charging current** | The lowest current used while charging is active (6–32 A). Some vehicles need 8–10 A as a minimum. |
| **Power calibration** | Corrects the displayed power by up to ±40 % (factor 0.6–1.4). |
| **Actual power** | Shows the real-time total power. |

**Other settings**

- **Energy price per kWh** — used to calculate session cost and savings
- **Hub** — settings for Hub communication
- **Date & time** — time zone and clock
- **System reboot** — restarts the station

**Hub communication**

| Setting | Description |
|---|---|
| **Selected Hub** | IP address and Portal ID of the Hub. |
| **Start charging at battery SoC** | Minimum home-battery state of charge before Solar mode starts. |
| **Stop charging at battery SoC if off-grid** | When the grid is unavailable, charging stops below this battery level. |
| **Allow battery/grid power in Solar mode** | Continue at the minimum current when surplus is insufficient, to reduce start/stop cycling. The ArcPort cannot decide whether the power comes from the battery or the grid; that is determined by the inverter. |
| **Top up from grid in Solar mode** | Make up any shortfall to the minimum power from the grid. |
| **Battery/grid power timeout** | Maximum continuous time the station may draw battery or grid power in Solar mode. |
| **Overload protection** | Reads overload status from the inverter. On overload, the station reduces current to the minimum and waits about 5 seconds. If the overload persists, charging stops and resumes only after the overload clears. If overloads recur within a short period, the maximum charging current is reduced by 10 %. |
| **Input current limit** | Shows the grid current limit applied in grid-tied systems. |
| **Virtual battery** | Emulates a battery for systems that have none, so Solar mode can still run. Do not enable this if a physical battery is installed. |

**Pairing-related options**

- **Enable communication** — turn Hub communication on or off
- **Communication type** — MQTT (preferred) or Modbus TCP
- **Establish communication / Unpair** — pair with, or disconnect from, a Hub
- **Device discovery** — find Hubs on the local network

**Date & time**

The correct date and time are essential for scheduled charging. Choose a region and time zone; if you choose UTC, also enter the correct offset.

### 5.5.7 Scheduler

When the charging mode is *Scheduled*, the station charges according to the schedules defined here. Multiple schedules can be created.

To add a schedule, tap **Add a new schedule** and set:

- **Enabled** — switch the schedule on or off
- **Start time** and **End time** — in 24-hour format
- **Current** — the maximum current during this schedule
- **Repeat** — *Daily*, *Mon–Fri*, *Weekends* or *Custom* (tick the days you want)

Tap **Save new schedule** to store it. Existing schedules can be enabled, edited or deleted at any time. A disabled schedule never runs.

> 💡 **Example — cheap night rate:** Start 23:30, End 05:30, Current 16 A, Repeat Daily. Combine this with a second schedule on weekends from 10:00 to 15:00 at 32 A to use midday solar.

> ⚠️ If the time cannot be synchronised, Scheduled mode will not start and warning W-207 appears.

### 5.5.8 Light ring

The Halo ring shows the station's status at a glance. A separate light scene can be defined for each of the following states:

- Disconnected
- Connected
- Waiting to start
- Waiting for sun
- Battery low
- Charging (manual)
- Charging (solar)
- Charged
- Fault

For each state you can choose:

- **Mode:** Static, Blink, Breathe, Colour wipe, Colour wipe inverse, Colour wipe reverse, Colour wipe reverse inverse, Colour wipe random
- **Colour:** from the colour picker, or by RGB value
- **Period:** the speed of the effect
- **Brightness:** 0–100 %
- **Try this scene:** previews the effect

There is also a **Brightness limit** that caps the brightness of all scenes. To turn the ring off completely, set the brightness to 0.

### 5.5.9 Access

Change the web user name and password here. Changing the defaults is strongly recommended.

### 5.5.10 Reset to defaults

You can reset all settings from NordLink. A confirmation message appears; tap **Yes** to continue. Afterwards, repeat first-use setup. On units shipped with firmware 1.9 or earlier, Bluetooth will also be switched off after a reset.

## 5.6 Touchscreen reference

The 4.3-inch touchscreen is at the front of the station.

**Home screen**

- Large status icon (disconnected, connected, charging, charged, fault)
- Live power in kW
- Session time, energy, cost and savings
- Mode selector (Manual / Solar / Scheduled)
- Current slider (Manual mode)
- Start/Stop button

**Settings screen** (tap the cog)

- Display brightness and timeout
- Language
- Wi-Fi status and signal strength
- Firmware version and serial number
- QR code linking to online support

**Screen lock**

When the display lock is enabled, the touchscreen shows status but cannot start, stop or change anything. This is the recommended setting for stations in public or shared locations. Unlock it from the web interface or NordLink.

## 5.7 Firmware updates

Firmware can be updated remotely through NordCloud or manually through the web interface.

**Remote update (easiest).** If the Nexus Hub is connected to NordCloud, open the Hub's page in NordCloud and choose **Update firmware** for the ArcPort. The update can be started with a single button press. Charging is not possible during the update.

**Manual update through the web interface.**

1. Download the latest firmware from the Nordvane professional portal. Make sure you pick the right file: files containing **AP22D** are for the display model (NV-AP22), and files containing **AP22N** are for the no-display model (NV-AP22-NS).
2. Open the web interface and click the **Backup & FW** tab.
3. Click **Open** and browse to the downloaded file (it ends in **.arcfw**).
4. Click **Update**.

After a successful update, the station restarts and the main page returns. All settings are preserved.

> ⚠️ Do not switch off the station during an update. If the update fails, wait two minutes and try again. If it fails repeatedly, contact support.

## 5.8 Reset and password recovery

> ℹ️ A **full reset** returns every setting to the factory defaults and requires first-use setup to be repeated. A **partial reset** resets only the admin password and the Bluetooth pairing code, and keeps all other settings.

### Full reset from the web interface

1. Log in and click the **Backup & FW** tab.
2. Click **Reset to factory defaults**.
3. Repeat first-use setup (Section 5.2).

### Full reset using NordLink

1. Open NordLink and tap the station.
2. Tap the cog wheel, then the three-dot menu, then **Reset to defaults**.
3. Confirm with **Yes**, then repeat first-use setup (Section 5.1).

### Partial or full reset using the DEF button

> ⚠️ **Qualified personnel only.** This procedure requires the unit to be powered with the cover removed. Mains voltage is present inside and can be fatal. Touch only the DEF button; keep clear of all other parts, especially the area marked in red inside the unit.

**Partial reset (admin password and pairing code)**

1. Remove the backing plate.
2. Press and hold the DEF button for **more than 5 seconds but less than 15 seconds**.
3. When you release it, the Halo ring flashes green rapidly while the reset happens.
4. Refit the backing plate and tighten the screws.
5. Log in using the default password from the internal label and assign a new admin password.

A phone that was already paired before the reset may remain connected. Other devices must pair with the default code.

**Full reset**

1. Remove the backing plate.
2. Press and hold the DEF button for **more than 15 seconds**, until the Halo ring flashes blue rapidly, then release.
3. Refit the backing plate and tighten the screws.
4. Repeat first-use setup.

## 5.9 Maintenance and cleaning

The ArcPort Home 22 has no user-serviceable parts and needs no scheduled maintenance. We nevertheless recommend the following checks:

| Interval | Check |
|---|---|
| Monthly | Inspect the socket, socket cover and charging cable for damage, dirt or moisture. |
| Every 6 months | Clean the housing and display with a soft damp cloth. Use no solvents, abrasives or high-pressure water. |
| Every 12 months | Check that the unit is firmly fixed to the wall and that the gland is tight. |
| Every 12–24 months | Test the upstream RCD with its test button. Have a qualified electrician perform periodic inspection as required by local regulations. |

> ⚠️ Switch off the supply before cleaning near the socket. Never spray water directly into the socket.

---

# 6. Troubleshooting

## 6.1 Vehicle detection and signal calibration

Starting with firmware v3.0, the control-pilot (CP) signal is calibrated automatically each time a vehicle is connected. The manual calibration button is therefore hidden in NordLink and the web interface. If you still have trouble with vehicle detection, you can re-enable manual calibration by setting Modbus TCP register **4210** to **0** (see Appendix 8.2). This disables automatic calibration and shows the calibration button.

### What is the CP signal?

CP (control pilot) is a communication line inside every Type 2 connector. It is bidirectional: the station tells the vehicle the maximum current available, and the vehicle tells the station whether it is connected, ready or charging.

### Why does it need calibrating?

The CP signal can vary with cable length, cable manufacturer and component tolerances. Calibration measures the actual signal and adjusts the station's thresholds.

### When is calibration needed?

- The vehicle is connected but the station still reports *Disconnected*
- The vehicle is unplugged but the station still reports *Connected*
- The station keeps switching between *Charging* and *Charged*
- Charging will not start after a vehicle is connected because the state cannot be recognised

### How to calibrate

After re-enabling manual calibration:

1. In the web interface go to **Settings → General → Charger → CP calibration**, or in NordLink open **Settings** and tap **Calibrate**.
2. Press **Calibrate**.
3. Connect the vehicle to the station, then tap **Next** in the app.
4. Press **Vehicle is connected** to confirm (or tap **Next** again in NordLink).
5. Wait while the station calculates. A message confirms success.

## 6.2 Hub pairing problems

First check that all versions meet the requirements in Section 5.3.

**No Hub found during discovery**

- Confirm that the ArcPort and the Hub are on the same network and subnet.
- Check the ArcPort's Wi-Fi signal. A value better than –70 dBm is recommended.
- Run discovery several times.
- Some networks block mDNS packets. If so, enter the Hub's IP address and Portal ID by hand.

**Errors during pairing**

- Make sure Hub pairing mode is still active (it times out after 2 minutes).
- A pairing error is shown with a code and reason.
- A message reading only "Pairing error" is an internal error. Check versions, retry, refresh the web interface or reconnect NordLink.

**W-204: Hub communication warning**

- Both devices must be on the same network.
- Check the Hub's IP address and Portal ID stored in the ArcPort.
- Check that the ArcPort is still in the Hub's paired list.
- Repeat pairing.

## 6.3 Wi-Fi problems

| Symptom | Likely cause | Remedy |
|---|---|---|
| Station does not appear in the Wi-Fi list | Hidden SSID or 5 GHz-only network | Add the network manually; enable 2.4 GHz on the router |
| Frequent disconnection | Weak signal | Move the router or add an access point; target better than –70 dBm |
| Cannot reach web interface | Different subnet or changed IP | Check the IP address in NordLink; use a fixed DHCP lease |
| Wi-Fi works but the Hub does not connect | Router blocks client-to-client traffic | Disable "AP isolation" or "client isolation" |
| Station reverts to AP mode | Wrong password or router changed | Re-enter credentials in the Network menu |

## 6.4 Frequently asked questions

### Q1: How do I prevent unauthorised people from using the station?

Disable **Autostart** in General settings so that charging does not begin automatically when a vehicle is connected. Also enable **Lock charger display** so the touchscreen cannot start or stop charging. Charging can then only be controlled through the web interface, NordLink, NordCloud or the Hub.

### Q2: Does the ArcPort have RFID?

No. Use the method in Q1 to restrict access.

### Q3: The light ring annoys my neighbours at night. Can I turn it off?

Yes. Set the brightness limit in the Light Ring menu to 0, or to a low level. You can also use a Scheduled dimming profile in the web interface to dim the ring only at night.

### Q4: Why is my vehicle not recognised when I plug in?

Try the CP calibration procedure in Section 6.1. Also check that the charging cable is fully inserted at both ends, that the cable and connector are clean and dry, and that the earth connection is good, because all measurements are relative to earth.

### Q5: Why does my ArcPort show up on more than one Hub?

If more than one Hub is on your network, enable the IP whitelist in the General tab of the web interface and add only the Hub that should control the station. Afterwards, remove the ArcPort from the other Hubs.

### Q6: How much solar power do I need to charge in Solar mode?

The minimum current for most vehicles is 6 A at 230 V, so you need more than about **1.4 kW** of surplus. If you enable **Top up from grid in Solar mode**, the shortfall is drawn from the grid. Some vehicles need a higher minimum current, for example 8–10 A; set the minimum charging current accordingly.

### Q7: Can I use more than one ArcPort in a system?

Yes. Available power is shared between them. Configure the sharing behaviour in the Hub.

### Q8: The vehicle is full but the station keeps starting and stopping. Why?

The station probably cannot decode the "charged" signal from the vehicle. Perform the CP calibration in Section 6.1.

### Q9: I keep getting warning W-204. What does it mean?

The ArcPort cannot read data from the Hub even though communication is enabled. For MQTT, the pairing may be lost or incomplete; see Section 6.2. For Modbus TCP, check that the IP address in General settings matches the Hub and that Modbus TCP is enabled on the Hub.

### Q10: Do I need a Hub?

Only for Solar mode. Manual and Scheduled modes work without one. A Hub is also needed for remote control through NordCloud.

### Q11: Can I control the ArcPort over Modbus TCP?

Yes. Modbus TCP provides more flexibility and access to more settings than the standard interfaces. The register list can be downloaded from the product page. Changes made through Modbus TCP are outside the standard support scope.

### Q12: Can I charge with a power-limited supply, such as a shared building connection?

Yes. Set the maximum charging current to the value allowed by your supply. With a Nexus Hub and a compatible energy meter, you can also enable dynamic load management so the ArcPort reduces its current when the building draws high power.

### Q13: Will the station keep working during a power cut?

The station needs mains power to operate. If it is on the output of a backup inverter, it will continue to run as long as the inverter can supply it. Charging current is then limited by Overload protection and the battery SoC limits.

### Q14: Can I mount the station on a pole?

Yes, provided the pole offers a solid, flat, vertical surface and the mounting hardware is rated for the station's weight (4.2 kg) with a safety factor.

### Q15: What happens to my settings after a firmware update?

All settings are retained.

## 6.5 Codes: errors, warnings and notices

The following codes appear in NordLink, on the Hub, on the touchscreen and in the web interface.

### Errors (charging blocked)

| Code | Hub code | Message | Meaning and action |
|---|---|---|---|
| E-01 | #01 | Earth not present | Protective earth is missing. Contact the installer. |
| E-02 | #02 | Welded contacts | The power relay contacts are welded. Isolate the supply and contact the installer. |
| E-03 | #03 | CP short-circuit | The control-pilot line is shorted. Try another cable; otherwise contact the installer. |
| E-04 | #04 | Residual DC current | The internal sensor detected DC leakage. Contact the installer. |
| E-05 | #05 | Over-temperature | The station is overheating. Move it out of direct sunlight or ask the installer to review the site. |
| E-06 | #06 | Ambient sensor fault | The temperature sensor is not responding. Contact the installer. |
| E-07 | #07 | Tamper detected | The housing has been opened while powered. Contact the installer. |
| E-08 | #08 | Supply voltage out of range | Supply is below 170 V or above 265 V. Check the supply. |
| E-09 | #09 | Phase loss | One or more phases are missing (three-phase installations). Check breaker, RCD and wiring. |

### Warnings (charging may continue, reduced, or be blocked)

| Code | Hub code | Message | Meaning and action |
|---|---|---|---|
| W-201 | #201 | Initial setup not completed | Perform first-use setup. |
| W-202 | #202 | Blocked by grid operator | The dry-contact input or a grid signal has blocked charging. Contact your grid operator. |
| W-203 | #203 | High temperature | The station is hot but still charging at reduced current. Shade it or contact the installer. |
| W-204 | #204 | Hub communication warning | Communication is enabled but not working. Check the Hub's IP and Portal ID. |
| W-205 | #205 | Overload detected | An overload was reported by the inverter or grid limit. |
| W-206 | #206 | Overload active | The overload is still present. |
| W-207 | #207 | Scheduled mode failed — time sync | The clock could not be synchronised. Check Wi-Fi and the time zone. |
| W-208 | #208 | Current limited by external input | The dry-contact input is active. |
| W-209 | #209 | Current limited by inverter over-temperature | The inverter reports over-temperature. |
| W-210 | #210 | Display update failed — broken file | Repeat the update. If it keeps failing, contact the installer. (Display model only.) |
| W-211 | #211 | Display update failed — communication | Contact the installer. (Display model only.) |
| W-212 | #212 | Display firmware updating | Wait for the update to finish. Charging is not possible meanwhile. |
| W-213 | #213 | Wi-Fi signal weak | RSSI is poorer than –80 dBm. Improve coverage. |
| W-214 | #214 | Clock reset | The internal clock lost power and was reset. Check the time zone. |

### Notices (informational)

| Code | Hub code | Message | Meaning and action |
|---|---|---|---|
| N-401 | #401 | Solar mode not available | You tried to select Solar mode but Hub communication is disabled. Enable it. |
| N-402 | #402 | Scheduled mode not configured | Add at least one schedule first. |
| N-403 | #403 | Vehicle disconnected — cannot start | Connect the vehicle before pressing Start. |
| N-404 | #404 | Charger error | Resolve the active error first. |
| N-405 | #405 | Initial setup not completed | Perform first-use setup. |
| N-406 | #406 | Charging will follow the schedule | The station is in Scheduled mode. Switch to Manual to control charging. |
| N-407 | #407 | Overload active — cannot start | Wait for the overload to clear. |
| N-408 | #408 | Display firmware updating — cannot start | Try again after the update. |

---

## 6.6 Common user errors and how to avoid them

Most service calls are not caused by faults. They are caused by a setting, a habit or a misunderstanding. Check this list before calling your installer.

### 6.6.1 Vehicle and cable mistakes

| Mistake | What you will see | What to do |
|---|---|---|
| Plug not pushed in fully at the vehicle or the station | Station shows *Disconnected*; or charging starts then stops | Push both ends until they click. Wait for the socket lock to engage (a soft clunk). |
| Vehicle's own charging schedule is active | Station shows *Connected* or *Waiting*, but no charging | Check the vehicle's app or screen. Disable its schedule or set it to "charge now". |
| Vehicle's charge limit already reached (for example, 80 %) | Station shows *Charged* early | Raise the limit in the vehicle. |
| Vehicle is locked or asleep | Charging does not start or the lock does not release | Unlock the vehicle, then try again. |
| Using the wrong cable type (Mode 2 "granny" cable) | Not detected; or error E-03 | The ArcPort needs a **Mode 3** Type 2 cable. |
| Cable dragged, stepped on or driven over | E-03 or E-04; intermittent detection | Replace the cable. Never use a cable with cracked insulation. |
| Cable left coiled while charging at high current | Cable gets hot; vehicle reduces current | Fully uncoil the cable when charging above 16 A. |
| Using an extension lead or adapter | Overheating, error codes, fire risk | **Never** use extension leads, cable reels or unapproved adapters. |
| Dirty, wet or iced connector | Intermittent detection; E-03 | Let it dry, brush off dirt with a dry brush. Do not use water or sharp tools. |
| Pulling the cable out while charging | Vehicle shows a fault; connector may be locked | Stop charging first (touchscreen, NordLink or vehicle), then unplug. |

### 6.6.2 Settings mistakes

| Mistake | Effect | Fix |
|---|---|---|
| Maximum current set higher than the supply allows | Main breaker or RCD trips; overheating | Set the maximum current in line with your breaker (Section 3.3). Ask your installer if unsure. |
| Maximum current set far too low | Charging is slow | Raise it in *Settings → General → Maximum charging current*. |
| Minimum current set higher than the vehicle accepts | Charging will not start in Solar mode | Set the minimum to 6 A unless your vehicle needs more. |
| Mode left on *Solar* or *Scheduled* when you wanted to charge now | No charging, or charging starts later | Switch to *Manual* and press **Start**. Notice N-406 means this. |
| Schedule time zone or clock wrong | Charging starts at the wrong time | Check *Date & Time*. See W-207 and W-214. |
| Overnight schedule entered wrongly (for example, start 23:00, end 05:00 on "Mon–Fri") | Friday night does not charge | Remember the schedule starts on the listed day. Use *Daily* or *Custom*. |
| Autostart disabled and forgotten | Vehicle plugs in, nothing happens | Press **Start**, or re-enable Autostart. |
| Display lock enabled and forgotten | Touchscreen does not respond to Start | Use NordLink or the web interface, or disable the lock. |
| *Virtual battery* turned on when a real battery exists | Solar mode behaves unpredictably | Turn it off in Hub settings. |
| Wrong *Charger position* (grid side vs. inverter output) | Solar mode misreads surplus | Set the position that matches the wiring (Section 5.5.6). |
| IP whitelist enabled without adding the Hub | W-204; Hub loses control | Add the Hub's address to the whitelist. |
| Wi-Fi password changed on the router | Station drops offline | Re-enter the password in the Network menu. |

### 6.6.3 Network and app mistakes

- **Choosing a 5 GHz network.** The ArcPort supports 2.4 GHz only.
- **Phone not in Bluetooth range.** Stay within a few metres and avoid metal obstructions.
- **Old pairing on the phone.** If NordLink cannot connect, remove the station from your phone's Bluetooth list and pair again.
- **Pairing mode timed out.** Hub pairing mode lasts two minutes. Start it again if it runs out.
- **Different networks.** The Hub and ArcPort must be on the same network and subnet. Guest networks are a common cause of this problem.
- **Router isolation.** Turn off "AP isolation" or "client isolation" on the router.

### 6.6.4 Password and access mistakes

- **Leaving the default password in place.** Change it during first-use setup.
- **Losing the password and the internal label.** Photograph the label at installation and keep the photo somewhere safe. Recovery needs an installer (Section 5.8).
- **Sharing the admin login widely.** Give family members NordLink access only if they need it; consider keeping the display lock on.

### 6.6.5 Physical and environmental mistakes

| Mistake | Risk | Correct practice |
|---|---|---|
| Leaving the socket cover open | Water, insects and dirt get in | Close the cover after each use. |
| Hanging the cable on the station | Strain damages the socket | Use a separate cable holder. |
| Covering the station (blanket, box, bags) | Overheating | Keep the unit uncovered with clear space around it (Section 3.2). |
| Pressure washing the station | Water ingress (rated IP54, not jet-proof) | Wipe with a damp cloth only. |
| Using solvents or abrasives to clean | Damages housing and display | Soft damp cloth, mild soap. |
| Storing items (tools, chemicals, fuel) near the station | Fire risk | Keep the area clear and ventilated. |
| Opening the unit | Electric shock; voids warranty | Only a qualified installer may open the unit. |
| Ignoring a tripping RCD and resetting it repeatedly | Fire or shock risk | Stop using the station and call an electrician. |

### 6.6.6 Quick self-check before calling support

1. Is the plug fully in at both ends, and does the station show *Connected*?
2. Is the vehicle awake, unlocked and set to charge now?
3. Is the station in the right mode (Manual for "charge now")?
4. Is there a code on the display, in NordLink or on the Hub? Look it up in Section 6.5.
5. Does the station have power (display or ring lit)?
6. Does another cable or vehicle behave the same way?
7. Has anything changed recently (router, password, settings, firmware, new vehicle)?

## 6.7 Overheating and thermal management

The ArcPort Home 22 monitors its own temperature continuously and protects itself in three stages. Most overheating situations are caused by the installation environment or the way the station is used, and can be fixed without replacing anything.

### 6.7.1 How the station protects itself

| Stage | Internal temperature | What the station does | What you see |
|---|---|---|---|
| Normal | Below 70 °C | Full current available | Normal operation |
| **Derating** | 70 °C and above | Reduces charging current in steps to keep the temperature under control | Warning **W-203**, slower charging, ring may show amber/orange (default) |
| **Stop** | 75 °C (board) or 85 °C (terminals) | Charging stops | Error **E-05**, ring flashes red |
| **Recovery** | Below 65 °C | Charging can resume | E-05 clears automatically; restart may be needed |

> ℹ️ Derating is normal protective behaviour, not a fault. A vehicle charging more slowly on a very hot day is the station doing its job.

### 6.7.2 Warm versus too hot

| Touch test (outside only, after charging) | Meaning |
|---|---|
| Housing slightly warm | Normal at high current |
| Housing warm over the whole surface, comfortable to hold your hand on | Normal at 32 A in hot weather |
| Housing too hot to hold your hand on for 5 seconds | **Stop charging and investigate** |
| Hot spot near the cable gland or lower part | Possible loose terminal; call an electrician |
| Smell of burning, melted plastic or discolouration | **Stop immediately. Isolate the supply at the breaker. Do not use the station.** Call an electrician |

> ⚠️ Never open the station to check for heat. Mains voltage is present inside.

### 6.7.3 Common causes of overheating

| Cause | Why it matters | What to do |
|---|---|---|
| Direct sunlight, especially on dark surfaces or south-facing walls | Adds heat on top of the heat from charging | Fit a shade or a canopy; move the station to a shaded wall |
| High ambient temperature (above about 35 °C) | Less margin for self-heating | Lower the maximum charging current (for example, 24 A) during heatwaves; charge in the evening or at night |
| Charging at 32 A for many hours | Continuous full load is the most demanding case | Reduce the current; most vehicles do not need 32 A overnight |
| Enclosed or covered location (cabinet, box, tight niche) | Heat cannot escape | Allow at least 200 mm at the sides and 300 mm below; do not enclose |
| Mounted above a heat source (boiler flue, heat pump exhaust, dryer vent) | Hot air flows over the housing | Relocate or add a shield |
| Loose or corroded terminal inside | Extra resistance creates local heat | Have an electrician re-torque and inspect the terminals |
| Undersized or overly long supply cable | Voltage drop and heat in the cable | Have the cable checked against Section 3.3 |
| Poor cable or connector at the vehicle end | Heat at the connector | Inspect for discolouration; replace damaged cables |
| Coiled charging cable at high current | Cable overheats | Uncoil completely |
| Dirty or blocked housing surface | Reduces cooling | Clean with a damp cloth |

### 6.7.4 What you can do straight away

1. **Stop charging** if the housing is too hot to touch or you smell burning.
2. **Let the station cool** for at least 30 minutes.
3. **Reduce the maximum current** (for example, to 16 A or 24 A) in *Settings → General*.
4. **Move charging to cooler times** with Scheduled mode (for example, 22:00–06:00).
5. **Shade the station** from the sun.
6. **Check clearances** and remove anything covering the unit.
7. **Inspect the cable and plug** for heat marks or deformation.
8. If W-203 or E-05 keeps returning at moderate temperatures, call an electrician. Do not ignore it.

### 6.7.5 Recommended maximum current by ambient temperature

These are guidance values for a station in shade on a well-ventilated wall. Direct sun reduces them.

| Ambient temperature | Recommended maximum continuous current |
|---|---|
| Below 30 °C | 32 A |
| 30–35 °C | 32 A, expect occasional derating |
| 35–40 °C | 24–28 A |
| 40–45 °C | 20–24 A |
| 45–50 °C | 16 A |
| Above 50 °C | Outside the operating range. Do not charge. |

### 6.7.6 Other things that overheat, and what they feel like

| Component | Typical sign | Action |
|---|---|---|
| Charging cable | Plug warm or hot, soft or discoloured | Stop; replace cable |
| Vehicle inlet | Vehicle displays a temperature warning | Reduce current; have the inlet inspected |
| Distribution board breaker or RCD | Warm or humming; discoloured | Call an electrician immediately |
| Supply cable | Warm along its length | Cable too small or damaged; call an electrician |

### 6.7.7 Preventing overheating — checklist

- [ ] Station mounted in shade or fitted with a sun shield
- [ ] At least 200 mm clear at the sides and 300 mm below
- [ ] Nothing covering or stored against the station
- [ ] Maximum current matched to supply and climate
- [ ] Supply cable correctly sized (6 mm² or larger for long runs)
- [ ] Terminals re-checked at the annual inspection
- [ ] Charging cable uncoiled and undamaged
- [ ] Heatwave plan: lower current or night charging

---

## 6.8 Symbolic code map

Every code the station shows has a short **symbolic name**. The symbolic name is the stable identifier used in the diagnostic log, in the NordCloud API and in support tools; the display code (for example **W-203**) is what you see on the screen. Use whichever you have.

| Symbolic code | Display code | Log event | Meaning |
|---|---|---|---|
| `E_OVERHEAT_WARN` | W-203 | 0x32 OVERTEMP_WARN | Station is hot and is reducing current |
| `E_OVERHEAT_TRIP` | E-05 | 0x33 OVERTEMP_TRIP | Station is too hot and has stopped charging |
| `E_AMBIENT_SENSOR_FAULT` | E-06 | 0x34 AMB_SENS_FAIL | Temperature sensor not responding |
| `E_TERMINAL_HOT` | (log-derived, no display code) | `T_term` vs `T_board` | Mains terminals running much hotter than the board |
| `E_EARTH_MISSING` | E-01 | 0x30 PE_LOST | Protective earth not detected |
| `E_CONTACTOR_WELDED` | E-02 | 0x21 RELAY_STICK | Contactor will not open |
| `E_CP_SHORT` | E-03 | 0x11 CP_SHORT | Control-pilot line shorted |
| `E_DC_LEAKAGE` | E-04 | 0x31 RDC_TRIP | DC leakage above 6 mA |
| `E_TAMPER` | E-07 | 0x3A TAMPER_OPEN | Cover opened while powered |
| `E_VOLTAGE_RANGE` | E-08 | 0x40 V_RANGE | Supply voltage out of range |
| `E_PHASE_LOSS` | E-09 | 0x41 PHASE_LOST | A phase is missing |
| `E_HUB_COMM_LOST` | W-204 | 0x51 MQTT_LOST | Communication with the Hub failed |
| `E_OVERLOAD` | W-205 / W-206 | 0x61 OVERLOAD_SET | Overload reported by inverter or grid limit |
| `E_TIME_SYNC` | W-207 | 0x70 TIME_SYNC_FAIL | Clock not synchronised |
| `E_LOAD_CONTROL_ACTIVE` | W-208 | 0x60 LOADCTRL_ON | Grid-operator limit active |
| `E_WIFI_WEAK` | W-213 | – | Wi-Fi signal poor |
| `E_NO_VEHICLE_DETECTED` | N-403 | 0x10 CP_STATE_CHG | Vehicle not recognised |
| `E_CP_UNSTABLE` | (no display code) | 0x10 toggling B↔C | Start/stop cycling, unstable CP |
| `E_RCD_TRIP_EXTERNAL` | (no display code) | – | The house RCD tripped, not the station |
| `E_SLOW_CHARGE` | (no display code) | – | Charging slower than expected |
| `E_PLUG_LOCKED` | (no display code) | – | Plug will not release from the socket |

> ℹ️ "No display code" means the station does not raise a code of its own for that condition. The symbolic name is used so that these common complaints can still be searched and tracked.

## 6.9 Overheating — `E_OVERHEAT_WARN`, `E_OVERHEAT_TRIP` and related issues

This section is a focused, quick-reference version of the overheating guidance in Sections 6.7 and 17.11. Search terms: *overheating, thermal warning, station hot, slow in summer, derating, burning smell*.

### 6.9.1 `E_OVERHEAT_WARN` (W-203) — thermal warning

**What it means.** The internal temperature has passed **70 °C**. The station is protecting itself by reducing the charging current in steps. Charging continues, more slowly.

**What you will see**

- Warning **W-203** in NordLink, on the touchscreen and on the Hub
- Charging power lower than the set current
- Halo ring in the *Fault/Warning* scene (amber by default)
- Event `0x32 OVERTEMP_WARN` in the log

**Most likely causes (in order of how often they occur)**

1. Direct sun on the station, especially in the afternoon
2. Hot weather (above 35 °C) with charging at 32 A
3. Station enclosed, covered, or mounted over a heat source
4. Loose terminal or undersized cable adding heat inside the unit
5. Faulty temperature sensor (reads too high)

**What the user should do**

1. Do not stop charging unless the unit is too hot to touch or smells of burning. Derating is the protection working.
2. Lower **Maximum charging current** to 16–24 A (*Settings → General*).
3. Move charging to the cool part of the day (Scheduled mode, for example 22:00–06:00).
4. Shade the station and clear anything covering it.
5. If W-203 appears again in mild weather or at low current, ask an electrician to inspect the terminals.

**What the installer should do.** Check the log for `T_board`, `T_term` and `T_amb`. If `T_term` climbs much faster than `T_board`, treat it as `E_TERMINAL_HOT` (6.9.3). Otherwise follow Section 17.11.3.

**Escalate** if W-203 is accompanied by discolouration, a burning smell or any deformation of the housing.

### 6.9.2 `E_OVERHEAT_TRIP` (E-05) — over-temperature stop

**What it means.** The board has reached **75 °C**, or the terminals **85 °C**. Charging has stopped to prevent damage. It restarts once the station cools below **65 °C**.

**What you will see**

- Error **E-05**, charging stopped, red flashing ring
- Event `0x33 OVERTEMP_TRIP`
- Usually preceded by W-203 in the log

**What to do**

1. Stop using the station for at least 30 minutes.
2. Check that the housing is not covered and is not in direct sun.
3. Reduce the maximum current and restart.
4. If E-05 returns within a day at normal ambient temperature, **call an electrician**. A repeat trip means the cause is not the weather.

**Never** bypass or disable thermal protection, and never cover the unit with a heat reflector that traps air against the housing.

### 6.9.3 `E_TERMINAL_HOT` — hot mains terminals

**What it means.** The terminals inside the unit are running much hotter than the electronics. The usual cause is a **loose or poorly crimped conductor**, which has higher electrical resistance and heats under load.

**Signs**

- `T_term` more than 15 °C above `T_board` at high current
- Hot patch near the cable gland or the lower part of the housing
- W-203 or E-05 on cool days
- Discolouration of the housing near the gland (in severe cases)

> ⚠️ This is a **fire risk**. Treat it as urgent. Stop charging, isolate the supply, and have a licensed electrician inspect, re-terminate with new ferrules, and re-torque to 2.0 Nm. See 17.11.4.

### 6.9.4 `E_AMBIENT_SENSOR_FAULT` (E-06) — temperature sensor problem

If the station shows a temperature that does not match reality (for example 70 °C in the cold morning), or E-06 appears, the sensor or its connector is faulty. Because thermal protection relies on this sensor, **do not leave the station in service** with a suspected sensor fault. See 15.6 and 17.11.6.

### 6.9.5 Overheating decision table

| Observation | Probable symbolic code | Quick action |
|---|---|---|
| Slow charging on a hot sunny afternoon, W-203 | `E_OVERHEAT_WARN` | Shade; lower current; night charging |
| Charging stops on hot days, E-05, restarts later | `E_OVERHEAT_TRIP` | Same, plus check clearances |
| Overheating at 16 A on a mild day | `E_TERMINAL_HOT` | Electrician: check terminals |
| Wrong temperature reading, E-06 | `E_AMBIENT_SENSOR_FAULT` | Electrician: replace sensor/board |
| Cable or plug hot, station normal | Cable problem | Replace cable; uncoil while charging |
| Burning smell, melted plastic | Urgent fault | Switch off at breaker; call electrician |

### 6.9.6 Seasonal guidance

| Season / condition | Recommendation |
|---|---|
| Summer heatwave (> 35 °C) | Maximum 24 A; charge overnight; keep in shade |
| Mild weather | Normal settings |
| Winter (< 0 °C) | Overheating unlikely; check for ice in the socket instead |
| Station facing south with no shade | Fit a shield or relocate before summer |

## 6.10 Other common issues with the charging point

Each entry gives the symbolic code, how it appears, the likely cause and the fix. Use the symbolic code as a search term.

### 6.10.1 `E_NO_VEHICLE_DETECTED` (N-403) — vehicle not recognised

**Symptoms.** The vehicle is plugged in but the station shows *Disconnected*; pressing Start gives N-403.

**Causes.** Plug not fully seated; dirty or wet socket; damaged cable; wrong cable type; control-pilot (CP) signal drift.

**Fix.** Push both plug ends in until they click. Try another cable. Dry and clean the socket with a dry brush. If the problem persists with a known-good cable, ask an installer to check CP (Sections 6.1, 17.2).

### 6.10.2 `E_CP_UNSTABLE` — charging starts and stops repeatedly

**Symptoms.** The ring and the vehicle alternate between *Charging* and *Charged* or *Connected*; the contactor clicks repeatedly.

**Causes.** CP calibration drift; worn cable; the vehicle's own charge limit or schedule; in Solar mode, surplus power hovering near the minimum.

**Fix.** Check the vehicle's limits first. In Solar mode enable *Allow battery/grid power* and *Smooth-start hold*. Otherwise run CP calibration (6.1) and try another cable. Section 17.6.

### 6.10.3 `E_SLOW_CHARGE` — charging slower than expected

**Symptoms.** The vehicle charges below the rated power (for example 7 kW on a 22 kW station).

**Common causes (check in this order)**

1. The **vehicle's on-board charger** is limited to 7.4 kW or 11 kW. This is normal.
2. **Maximum current** set low in the station.
3. **Thermal derating** (`E_OVERHEAT_WARN`).
4. **Overload or Hub limit** (`E_OVERLOAD`, `E_LOAD_CONTROL_ACTIVE`).
5. **Low supply voltage** under load.
6. **Cold vehicle battery** in winter.
7. **Single-phase supply** (7.4 kW maximum).
8. **Cable limit** (13 A or 20 A cable on a 32 A station).

See Section 17.5 for measurements.

### 6.10.4 `E_RCD_TRIP_EXTERNAL` — the house RCD trips

**Symptoms.** The breaker or RCD in the distribution board trips when charging or when the station is switched on. The station itself shows no code.

**Causes.** Leakage in the vehicle or cable; moisture in the socket; a type A RCD blinded by DC leakage; the RCD shared with other equipment.

**Fix.** Do not keep resetting it. Try another cable and vehicle. If the trip follows the station, switch off and call an electrician. Section 17.4.

### 6.10.5 `E_PLUG_LOCKED` — plug will not come out

**Symptoms.** The charging plug cannot be removed from the station socket after charging.

**Causes.** The socket lock is still engaged because charging has not been stopped; the vehicle is locked; power was lost during a session; the lock motor is stiff in cold weather.

**Fix, in order**

1. Stop charging on the vehicle, the touchscreen or NordLink.
2. Unlock the vehicle (key fob or app); many vehicles unlock the plug when the car is unlocked.
3. In NordLink, open *Overview → ⋮ → Release plug*.
4. Wait 10 seconds and try again; do not pull hard.
5. If power has failed, restore power or use the **manual release** (installer only): isolate the supply, open the unit, and turn the lock release screw on the socket assembly a quarter turn.
6. If the lock is repeatedly stuck, replace the socket assembly (20.4).

> ⚠️ Never force the plug out of a locked socket; this can damage both the cable and the socket.

### 6.10.6 `E_HUB_COMM_LOST` (W-204) — lost contact with the Hub

**Symptoms.** Warning W-204; Solar mode unavailable; station missing from the Hub.

**Causes.** Hub or router restarted and changed IP address; pairing lost; Wi-Fi weak; Hub on a different network; IP whitelist excluding the Hub.

**Fix.** Section 16.3. Quick version: check both devices are on the same network, press **Discover**, then **Pair**.

### 6.10.7 `E_WIFI_WEAK` (W-213) — weak Wi-Fi

**Symptoms.** NordLink or the web interface drops out; Hub warnings; W-213.

**Causes.** Station far from the router; metal garage doors or walls; 2.4 GHz interference.

**Fix.** Aim for better than –70 dBm. Add an access point near the station, change the router channel to 1, 6 or 11, or fit the external antenna kit (NV-ANT-01). Section 16.7.

### 6.10.8 `E_TIME_SYNC` (W-207) — schedules not running

**Symptoms.** Scheduled mode will not start; wrong start times; W-207 or W-214.

**Causes.** Clock lost after a power cut; wrong time zone; no internet or Hub for time sync.

**Fix.** Set the correct region and time zone; check connectivity; allow UDP port 123 outbound. Section 16.5.

### 6.10.9 `E_OVERLOAD` (W-205 / W-206) — power reduced because of overload

**Symptoms.** Charging drops to the minimum or stops when the oven, heat pump or other large loads start.

**Fix.** Lower the maximum charging current, or use Hub load management so other loads pause. Section 16.4.

### 6.10.10 `E_VOLTAGE_RANGE` (E-08) and `E_PHASE_LOSS` (E-09) — supply problems

**Symptoms.** Station stops with E-08 or E-09; other equipment in the building also misbehaves.

**Fix.** These are supply faults, not station faults. Ask an electrician to measure voltages. A suspected lost neutral is dangerous: switch off the supply. Sections 15.8, 15.9.

### 6.10.11 Display and light ring issues

| Symptom | Likely cause | Fix |
|---|---|---|
| Touchscreen does not respond | Display lock on; wet screen | Disable the lock; dry the glass |
| Blank display, ring works | Display firmware updating (W-212); ribbon cable | Wait; call installer if it persists |
| Ring dark | Brightness set to 0 | Raise brightness in Light Ring settings |
| Wrong ring colours | Custom scenes | Import default scenes |

### 6.10.12 Login and access issues

| Symptom | Likely cause | Fix |
|---|---|---|
| Cannot log in to the web interface | Wrong or forgotten password | Use the password on the internal label; or partial reset (5.8) |
| NordLink asks for a pairing code | New phone or reset | Use 000000 or the code on the internal label |
| Cannot find the station's IP | DHCP changed it | Check the router, or use NordLink *Network* page |

### 6.10.13 Quick lookup — symptom to symbolic code

| What the customer says | Look at |
|---|---|
| "It's slow when it's hot" | `E_OVERHEAT_WARN`, `E_SLOW_CHARGE` |
| "It stopped in the middle of the day" | `E_OVERHEAT_TRIP`, `E_OVERLOAD` |
| "It gets very hot to touch" | `E_TERMINAL_HOT` (urgent) |
| "It won't start" | `E_NO_VEHICLE_DETECTED`, N-406, Autostart setting |
| "It keeps starting and stopping" | `E_CP_UNSTABLE` |
| "The house breaker keeps tripping" | `E_RCD_TRIP_EXTERNAL` |
| "I can't get the plug out" | `E_PLUG_LOCKED` |
| "The app lost the charger" | `E_HUB_COMM_LOST`, `E_WIFI_WEAK` |
| "Schedule didn't run" | `E_TIME_SYNC` |

---

# 7. Technical Specification

| **ArcPort Home 22** | |
|---|---|
| Supply voltage range | 170–265 V AC (per phase), 50/60 Hz |
| Rated charging current | 32 A per phase |
| Nominal power | 22 kW (3-phase) / 7.4 kW (1-phase) |
| Configurable current | 6–32 A |
| Standby consumption | 3.5 W (display on), 1.8 W (display off) |
| Connector | IEC 62196-2 Type 2 socket, with cover |
| Charging mode | Mode 3 |

| **General** | |
|---|---|
| Disconnecting means | External breaker, max 40 A |
| Residual-current protection | Built-in 6 mA DC detection; external RCD required |
| Default energy price | 0.25 per kWh (adjustable) |
| Control | Touchscreen, web interface, Hub, NordLink (Bluetooth), NordLink Remote and NordCloud |
| Display | 4.3-inch colour touchscreen (display model only) |
| Light ring | 48 configurable effects |
| Communication | Wi-Fi 802.11 b/g/n (2.4 GHz), Bluetooth LE 5.0, MQTT, Modbus TCP |
| Operating temperature | –25 °C to +50 °C |
| Storage temperature | –40 °C to +80 °C |
| Humidity | up to 95 %, non-condensing |
| Altitude | up to 2,000 m |
| Dry-contact input | 1 × potential-free, 5 V sense |

| **Enclosure** | |
|---|---|
| Colour | Nordic grey (RAL 7037) with signal-teal accents |
| Material | UV-stabilised polycarbonate |
| Power terminals | 4–10 mm² (AWG 12–8) |
| Protection class | IP54, IK08 |
| Ventilation | Not required |
| Weight | 4.2 kg |
| Dimensions (H × W × D) | 392 × 288 × 156 mm |

| **Standards** | |
|---|---|
| Safety | IEC 61851-1, IEC 61851-22, IEC 62955 (DC detection) |
| EMC | EN 301 489, IEC 61851-21-2 |
| Radio | EN 300 328 |
| Detection | Welded contact, missing earth, shorted CP, phase loss |
| Marking | CE, UKCA |

## 7.1 Dimensions

```
                  288 mm
        ┌──────────────────────────┐
        │   ┌──────────────────┐   │
        │   │   4.3" display   │   │
        │   └──────────────────┘   │
        │        ╭──────────╮      │   392 mm
        │        │  Socket  │      │
        │        │  + Halo  │      │
        │        ╰──────────╯      │
        │      ARCPORT HOME 22     │
        └─────────────┬────────────┘
                      ▼  cable gland

 Mounting holes: 4 × Ø6.2 mm, 240 mm × 330 mm spacing
 Depth: 156 mm
```

---

# 8. Appendix

## 8.1 Grid-operator load control (dry-contact input)

In some countries, grid operators require the ability to reduce the charging power of home chargers to help maintain grid stability. The ArcPort provides a **dry-contact input** for this purpose. When the contact is closed, the maximum charging current is limited to a configurable value (default **6 A**). The warning **W-208** is displayed while the limit is active.

This function requires firmware 3.0 or later.

**Wiring**

```
   Receiver / relay contact (potential-free)
          ┌───────/ ───────┐
          │      S1        │
          │                │
     ─────┴────────────────┴─────
      DI-1                 DI-GND      ← ArcPort dry-contact terminals

   Logic:  S1 open   → no additional limit
           S1 closed → limit applied (W-208)
```

Use the second cable gland for the control cable. Keep the control wiring physically separate from mains conductors.

> 🔧 Consult the local grid-operator requirements before enabling this function. Some operators require certified receivers.

## 8.2 Modbus TCP integration

As an alternative to MQTT, the ArcPort can communicate with the Hub using Modbus TCP.

### On the Hub

1. Go to **Settings → Integrations → Modbus TCP Server** and enable it.
2. If your ArcPort has not yet been connected to this Hub **and** the Hub runs OS 2.4 or later, go to **Settings → Integrations → Modbus Devices → Discovered devices** and activate the ArcPort.

For ArcPorts that were connected before the Hub was updated to OS 2.4, this step is not needed.

### On the ArcPort

1. In **General → Hub**, set **Communication type** to *Modbus TCP*.
2. Use **Discover** to fill in the IP address and Portal ID, or enter them manually.
3. Click **Check** to test the connection and **Save** to apply.

### IP whitelist

For security it is strongly advisable to enable the **IP address whitelist** and add only those devices that need to communicate with the ArcPort. Some grid operators require it.

- **Enable IP address whitelist** — switches the function on or off
- **Add IP to whitelist** — adds a trusted address

> ⚠️ If you enable the whitelist, remember to add the Hub's address. Otherwise it will no longer be able to communicate with the ArcPort.

### Selected registers

| Register | Name | Access | Description |
|---|---|---|---|
| 4001 | Charging state | R | 0 = disconnected, 1 = connected, 2 = waiting, 3 = charging, 4 = charged, 5 = fault |
| 4002 | Active power (W) | R | Total power, all phases |
| 4005 | Session energy (Wh) | R | Energy in the current session |
| 4101 | Mode | R/W | 0 = Manual, 1 = Solar, 2 = Scheduled |
| 4102 | Set current (A) | R/W | Target current in Manual mode |
| 4103 | Start/Stop | R/W | 1 = start, 0 = stop |
| 4210 | Auto CP calibration | R/W | 1 = automatic (default), 0 = manual |

The full register list can be downloaded from the product page.

## 8.3 Web interface reference

After first-use setup, log in to the web interface at the station's IP address. Click **Settings** for further options. Six tabs are available.

### 8.3.1 The main page

From top to bottom:

- **Charging mode switch** — Manual, Solar or Scheduled
- **Charging current slider** — adjust the current
- **Start/Stop button** — in Manual mode
- **Session statistics and animated energy-flow overview**

### 8.3.2 Network tab

**Wi-Fi**

- *Wi-Fi mode:* toggles between Access Point and Station.
  - *Access point:* SSID, password, IP address and netmask are configurable.
  - *Station:* switch to Station, click **Scan** or **Add**, tick your network and click **Apply**, enter the password and click **Next**, set a manual IP if needed, and click **Save**. A signal-strength indicator appears at the top of the page.
- *Scan period:* with only one network, set it to 0 to avoid unnecessary scanning. With several networks, keep the default (60 s). This affects background scanning only.
- *RSSI threshold:* a minimum signal level applied to background scanning.

**Bluetooth**

- *State:* enable or disable Bluetooth. Press **Save** to apply.
- *Unpair all devices:* removes all paired phones. The station restarts, and you must also remove the pairing in your phone's Bluetooth menu.

The default pairing code is 000000 on older units; newer units have a unique code on the internal label.

### 8.3.3 General tab

Contains: **Charger**, **Hub**, **Modbus TCP server**, **Display**, **Date & time** and **Others**. The options match those in Section 5.5.6. In addition:

- **Display** — active/idle backlight (%), active timeout (s), lock charger display, hide Wi-Fi credentials
- **Others** — energy price per kWh and device name (the name is also updated on the Hub, in NordLink and in NordCloud)

### 8.3.4 Scheduler tab

Create, edit and delete schedules. Schedules are only active when the station is in Scheduled mode. The currently active schedule is highlighted in green. Use **Import** and **Export** to move schedules as `.json` files.

### 8.3.5 Light Ring tab

Customise the ring. Click **Save** after any change. Light-ring settings can be imported and exported as `.json`.

### 8.3.6 Access tab

Change the user name and password. Passwords need at least 8 characters, with upper-case, lower-case and special characters.

### 8.3.7 Backup & FW tab

- *FW update:* upload an `.arcfw` file and click **Update**.
- *Backup:* export or import all settings as a `.json` file.
- *Reset to factory defaults.*

## 8.4 Light ring status reference

The following are the factory-default light scenes.

| State | Colour | Pattern | Meaning |
|---|---|---|---|
| Disconnected | Yellow | Static, 25 % | No vehicle connected |
| Connected | Blue | Breathe | Vehicle connected, not charging |
| Waiting to start | Cyan | Breathe | Ready; waiting for a command or schedule |
| Waiting for sun | Amber | Breathe | Solar mode, waiting for surplus |
| Battery low | Orange | Blink | Hub reports battery below start threshold |
| Charging (manual) | Green | Colour wipe | Charging in Manual or Scheduled mode |
| Charging (solar) | Bright green | Colour wipe reverse | Charging from solar surplus |
| Charged | White | Static | Vehicle full |
| Fault | Red | Blink | An error is active |
| Partial reset | Green | Rapid blink | Password reset in progress |
| Full reset | Blue | Rapid blink | Factory reset in progress |

---

# 9. Warranty, Support and Disposal

## 9.1 Limited warranty

Nordvane Energy warrants the ArcPort Home 22 against defects in materials and workmanship for **36 months** from the date of purchase by the original owner, provided the unit has been installed by a qualified person and used in accordance with this manual.

**The warranty does not cover:**

- Damage caused by incorrect installation, incorrect electrical protection, or a faulty supply
- Lightning, surge or flood damage
- Unauthorised opening, modification or repair
- Damage to charging cables, vehicles or third-party equipment
- Normal wear of the socket cover and seals
- Settings changed through unsupported interfaces such as direct Modbus register writes

Keep your proof of purchase and installation record. The installer's name, date and measurement results will be requested when making a claim.

## 9.2 Getting support

1. Check this manual, including Section 6.
2. Visit **support.nordvane.example** for tutorials, firmware and the register list.
3. Contact your installer or the reseller you bought from.
4. If necessary, your reseller will escalate the case to Nordvane Technical Support.

Please have the **model, serial number, firmware version, error code** and a short description of the problem ready.

## 9.3 Disposal

This product contains electronic components and must not be thrown away with household waste. Take it to a collection point for electrical and electronic equipment, or return it to your reseller. Remove all personal data first by performing a full factory reset.

## 9.4 Regulatory information

The ArcPort Home 22 complies with the relevant requirements of the radio-equipment, low-voltage and EMC directives applicable in the regions where it is sold. The declaration of conformity can be downloaded from the product page.

---

# 10. Glossary

| Term | Meaning |
|---|---|
| **AC** | Alternating current. |
| **AP / Access point** | A Wi-Fi network created by the station itself. |
| **CP (control pilot)** | A signal line that lets the station and vehicle communicate. |
| **DEF button** | A recessed reset button inside the unit. |
| **EVSE** | Electric vehicle supply equipment; the technical name for a charging station. |
| **Halo ring** | The programmable LED ring around the socket. |
| **Hub** | The Nexus Hub energy gateway. |
| **MQTT** | A lightweight messaging protocol used between the station and the Hub. |
| **Modbus TCP** | An industrial communication protocol, offered as an alternative to MQTT. |
| **PE** | Protective earth. |
| **RCD** | Residual-current device; a safety switch that trips on leakage current. |
| **RSSI** | Received signal strength indicator; a measure of Wi-Fi signal quality. |
| **SoC** | State of charge of a battery, in percent. |
| **Surplus** | Solar production minus household consumption. |
| **Type 2** | The standard European AC charging connector (IEC 62196-2). |

---

# 11. Revision History

| Rev | Date | Changes |
|---|---|---|
| 1 | March 2024 | First release |
| 2 | July 2024 | Added Scheduled mode details and NordLink Remote |
| 3 | November 2024 | Added IP whitelist and Modbus TCP register table |
| 4 | April 2025 | Added dry-contact input (Appendix 8.1) |
| 5 | September 2025 | Added phase-loss and supply-voltage error codes |
| 6 | March 2026 | Added MQTT pairing with Nexus Hub; Modbus TCP moved to appendix |
| 7 | October 2026 | Automatic CP calibration; expanded FAQ; added light ring reference and maintenance schedule |
| 8 | October 2026 | Added Part II: Technical Service Manual (Sections 12–22) |
| 9 | October 2026 | Added Section 6.6 (user errors), 6.7 (overheating) and 17.11 (overheating service diagnosis) |
| 10 | October 2026 | Added symbolic code map (6.8), overheating quick reference (6.9) and common-issues catalogue (6.10) |

---

---
---

# PART II — TECHNICAL SERVICE MANUAL

> 🔧 **Audience:** Part II is written for qualified electricians and Nordvane-certified service technicians. It contains procedures that involve live mains voltage. Do not attempt these procedures unless you are trained and authorised to do so. Part I (Sections 1–11) remains the reference for normal operation.

> ℹ️ All part numbers, voltages, register values and thresholds in this document are for the fictional ArcPort Home 22.

---

# 12. Service Requirements, Tools and Safe Working

## 12.1 Technician qualifications

A technician working on the ArcPort Home 22 must:

- Hold a valid electrical qualification recognised in the country of work
- Be trained to perform live-fault diagnostics and to apply safe isolation procedures
- Have completed the Nordvane ArcPort service course (certificate NV-SVC-AP2) before replacing any internal part under warranty
- Have read Sections 1, 3 and 5 of this manual

## 12.2 Required tools and test equipment

| Item | Specification | Used for |
|---|---|---|
| Multimeter | CAT III 600 V, true-RMS, ≥ 10 MΩ input | Voltage, resistance, continuity |
| Two-pole voltage tester | Class 3, with proving unit | Proving dead |
| Installation tester (MFT) | Compliant with IEC 61557 | Earth-loop impedance, RCD, insulation, polarity |
| EVSE test adapter | Type 2, with CP/PP simulation (states A–F, fault injection) | Simulating a vehicle |
| Oscilloscope | ≥ 20 MHz, 2 channels, 10:1 probes | Observing CP waveform |
| Clamp meter | AC/DC, true-RMS, 40 A range | Measuring charging current |
| Torx driver set | T10, T20 (security), T25 | Opening and servicing |
| Torque screwdriver | 0.5–5 Nm | Tightening terminals and screws |
| Insulated hand tools | VDE 1000 V rated | Work near live parts |
| Laptop with Wi-Fi | Chrome/Edge/Firefox | Web interface and log export |
| Smartphone with NordLink | v4.1 or later | Bluetooth service access |
| ESD wrist strap | With ground lead | Handling circuit boards |
| Thermal camera (optional) | ≥ 160 × 120 | Finding hot terminals |

## 12.3 Personal protective equipment

- Insulated gloves rated for the working voltage when working on any exposed live part
- Safety glasses or face shield when performing live measurements
- Non-conductive footwear

## 12.4 Safe isolation procedure

Always follow this sequence before touching any part inside the housing, except where a procedure expressly says the unit must be powered.

1. Make sure the vehicle is unplugged and the Type 2 socket is empty.
2. Switch off the charging-circuit breaker and RCD in the distribution board.
3. Apply a lock-out/tag-out device and a warning tag.
4. Using a two-pole voltage tester, **prove the tester on a known live source**.
5. Test between L1–N, L2–N, L3–N, L1–L2, L2–L3, L1–L3 and each conductor to PE at the station's terminals.
6. **Prove the tester again** on the known live source.
7. Wait **at least 60 seconds** for internal capacitors to discharge before touching the board.

> ⚠️ If a procedure requires power with the cover removed (for example, DEF button or live voltage measurement), touch only the points listed. The red-marked area on the label inside the unit indicates high-voltage parts. Never touch the main relay, current sensors, mains terminals or transformer while the unit is powered.

## 12.5 Working practices

- Use ferrules on all stranded conductors.
- Replace any seal or gasket that is damaged, hardened or flattened.
- Take photographs of the wiring before disconnecting anything.
- Record the serial number, firmware version, active codes and all measured values on the service record (Section 22).
- After any repair, run the commissioning test (Section 19) before returning the station to the customer.

---

# 13. Internal Architecture and Test Points

## 13.1 Block diagram

```
                       ┌──────────────────────────────────────────────────┐
  Mains L1 L2 L3 N PE  │                 ARCPORT HOME 22                  │
  ───────────────────▶ │  ┌───────────┐   ┌─────────┐   ┌──────────────┐  │  Type 2
                       │  │ Terminal  │──▶│ Contactor│──▶│ Current/     │──┼─▶ socket
                       │  │ block     │   │ K1 (4P) │   │ DC-leak CTs │  │   L1-L3,N,PE
                       │  └─────┬─────┘   └────▲────┘   └──────┬───────┘  │
                       │        │              │ coil drive    │          │
                       │  ┌─────▼─────┐   ┌────┴───────────────▼───────┐  │
                       │  │ PSU       │──▶│  MAIN CONTROLLER (MCU)     │  │
                       │  │ 230V→12V/ │   │  - CP generator/monitor    │◀─┼─ CP, PP
                       │  │ 5V/3.3V   │   │  - Relay supervision       │  │
                       │  └───────────┘   │  - Metering                │  │
                       │                  │  - Fault logic             │  │
                       │                  └───┬────────┬────────┬──────┘  │
                       │                      │        │        │         │
                       │               ┌──────▼──┐ ┌───▼────┐ ┌─▼──────┐  │
                       │               │ Wi-Fi/BT│ │ Display│ │ LED    │  │
                       │               │ module  │ │ board  │ │ driver │  │
                       │               └─────────┘ └────────┘ └────────┘  │
                       │   Dry-contact input (DI-1 / DI-GND)              │
                       └──────────────────────────────────────────────────┘
```

## 13.2 Main board layout

| Ref | Item | Notes |
|---|---|---|
| **TB1** | Mains terminal block (L1, L2, L3, N, PE) | 4–10 mm², torque 2.0 Nm |
| **K1** | 4-pole power contactor | Coil 12 V DC; auxiliary feedback contact |
| **CT1–CT3** | Current transformers (one per phase) | Used for metering and overload |
| **RDC1** | DC residual-current sensor (6 mA) | Trips E-04 |
| **F1** | Control-circuit fuse | T 500 mA / 250 V, 5 × 20 mm |
| **F2** | Contactor-coil fuse | T 1 A / 250 V, 5 × 20 mm |
| **SPD1** | On-board varistor (MOV) | Replace if discoloured |
| **J2** | Display board connector (ribbon, 20-pin) | Display model only |
| **J3** | LED ring connector | 4-pin |
| **J4** | Dry-contact input | DI-1, DI-GND |
| **J5** | Type 2 socket harness | CP, PP, lock motor |
| **SW1** | DEF button | Reset (see 5.8) |
| **TP1–TP8** | Test points (see 13.3) | |
| **LED1–LED4** | Service LEDs (see 13.4) | |

## 13.3 Test points

> ⚠️ Test points may be live relative to PE. Use a CAT III probe with a safe tip, and only when instructed.

| Test point | Signal | Expected value |
|---|---|---|
| TP1 | +12 V rail | 11.4–12.6 V DC vs. TP2 |
| TP2 | 0 V reference | Reference only |
| TP3 | +5 V rail | 4.85–5.15 V DC vs. TP2 |
| TP4 | +3.3 V rail | 3.20–3.40 V DC vs. TP2 |
| TP5 | Contactor coil drive | 0 V idle; ≈ 11.5 V when energised |
| TP6 | CP (control pilot), post-buffer | See Section 18.1 |
| TP7 | PP (proximity pilot) sense | See Section 18.2 |
| TP8 | Contactor aux feedback | 3.3 V = contacts open; 0 V = contacts closed |

## 13.4 Service LEDs

| LED | Colour | Meaning |
|---|---|---|
| LED1 | Green | Steady = MCU running; flashing 1 Hz = normal heartbeat |
| LED2 | Blue | Bluetooth active |
| LED3 | Yellow | Wi-Fi: steady = connected; flashing = connecting; off = disabled |
| LED4 | Red | Steady = active error; flashing = warning present |

---

# 14. Diagnostic Method and Data Sources

## 14.1 General approach

Follow the same sequence for every fault. It avoids unnecessary part replacement and unsafe live work.

1. **Collect:** ask the user what happened, when, with which vehicle and cable, and whether it is intermittent.
2. **Read:** record the active code(s), the firmware version, and export the diagnostic log (Section 14.2).
3. **Reproduce:** try with a known-good vehicle or test adapter and a known-good cable.
4. **Isolate:** decide whether the fault is in the supply, the station, the cable or the vehicle.
5. **Measure:** perform the checks listed for that code (Section 15 or 16).
6. **Repair:** apply the corrective action.
7. **Verify:** clear the code, retest, then complete the commissioning test (Section 19).
8. **Record:** complete the service record.

## 14.2 Exporting the diagnostic log

**Web interface**

1. Log in as admin.
2. Open **Backup & FW → Diagnostics**.
3. Click **Export log**. A file named `ARCP-<serial>-<date>.nvlog` is downloaded.

**NordLink**

1. Connect to the station.
2. Open **Settings → ⋮ → Product info → Service → Export diagnostics**.
3. Share the file to your email or cloud storage.

The log holds the last **500 events** and the last **72 hours** of 1-minute averages for voltage, current, temperature and Wi-Fi signal. See Section 21 for event codes.

## 14.3 Information to collect before contacting Nordvane support

- Serial number and model
- Firmware version
- Supply type (1-phase or 3-phase, TN-S, TN-C-S, TT)
- Active codes and the time they first appeared
- Vehicle make, model and year, and the charging cable used
- The exported `.nvlog` file
- Measured values from the relevant procedure in Section 15 or 16
- Photographs of the installation (with the cover removed)

## 14.4 Decision flow: is the fault in the station, cable, vehicle or supply?

```
              Charging fails or code appears
                          │
          Test with known-good cable + test adapter
                          │
         ┌────────────────┴────────────────┐
     Works                              Still fails
        │                                  │
  Fault is in the cable                    ▼
  or the vehicle                  Check supply voltage at TB1
  (test other vehicle)                     │
                              ┌────────────┴────────────┐
                         Out of range                In range
                              │                         │
                       Supply/installation       Read code, use Section 15/16
                       problem (Section 17.7)    for the specific procedure
```

---

# 15. Error Code Repair Procedures

Each procedure follows the same format: **What the code means → Typical causes → Checks (in order) → Corrective action → Escalation.**

Unless stated otherwise, isolate the supply (12.4) before opening the unit.

---

## 15.1 E-01 — Earth not present

**What it means.** The station cannot confirm a valid protective-earth (PE) connection. Charging is blocked.

**How it is detected.** The MCU measures the impedance between the PE terminal and an internal reference at each plug-in event and every 60 seconds during charging.

**Typical causes**

- PE conductor not connected, loose or broken
- High earth-loop impedance (poor earth electrode, corroded connection)
- Open PEN on a TN-C-S supply
- Damaged PE terminal or cracked solder joint on the board
- Mains supply wired with swapped N and PE

**Checks**

1. Visually inspect the PE conductor and ferrule at TB1. Re-torque to 2.0 Nm.
2. With the supply isolated, measure **continuity from the PE terminal at TB1 back to the main earth bar**. Expected: **< 0.5 Ω** (compensate for lead resistance).
3. Restore power. With the cover on, measure **earth-loop impedance (Zs)** at the station. Expected: **< 1.0 Ω** for a TN supply with a 40 A type B device, or as required by local regulations.
4. For TT supplies, measure the earth-electrode resistance. Expected: **< 100 Ω** (and low enough to satisfy the RCD disconnection requirements in your region).
5. Measure L–PE voltage at TB1. Expected: **≈ 230 V**. N–PE should be **< 2 V**. If N–PE is much higher, there is a neutral or earth fault upstream.
6. If measurements are good but the code persists, remove power and check the PE harness to the main board for cracked terminals.

**Corrective action**

- Repair or replace the PE connection; re-torque.
- Correct earth-electrode or bonding problems in the installation. This is the installer's responsibility.
- If the PE terminal block is damaged, replace the terminal block assembly (Section 20.5).
- If all external measurements are good and the fault is repeatable, replace the main board (Section 20.6).

**Escalate to Nordvane** if E-01 appears with an earth-loop impedance below 0.5 Ω and verified continuity.

---

## 15.2 E-02 — Welded contacts

**What it means.** After a stop command, the contactor feedback still shows the contacts closed, or voltage is present at the socket output when it should not be.

> ⚠️ **Safety:** a welded contactor means the socket may remain live even when the station reports "not charging". Treat the output as live until proven otherwise.

**Typical causes**

- Contactor contacts welded by a high inrush or short-circuit
- Contactor driven when vehicle sends overcurrent
- Mechanical wear (very high cycle count)
- Faulty contactor auxiliary contact or feedback wiring
- Control-board failure holding the coil energised

**Checks**

1. Isolate the supply and **prove dead** (12.4). Do not touch the socket pins; assume they may be live until the supply is isolated.
2. With the supply isolated, measure **continuity across each pole of K1** (input to output). Expected for a healthy, de-energised contactor: **open circuit (OL)**. Any continuity indicates welded contacts.
3. Restore power with the vehicle unplugged. Measure **TP5**. Expected: **0 V**. If TP5 shows ≈ 11.5 V while idle, the MCU or driver is holding the coil on (go to step 6).
4. Measure **TP8**. Expected with contacts open: **3.3 V**. If TP8 = 0 V but continuity (step 2) was open, the aux feedback is faulty.
5. Check the log for `EVT 0x21 RELAY_STICK` events and the cycle counter (`relay_cycles`). The contactor is rated for 100,000 cycles.
6. Check fuse **F2** (contactor coil). Replace with T 1 A / 250 V if blown and investigate the cause.

**Corrective action**

| Finding | Action |
|---|---|
| Welded contact poles | Replace contactor K1 (Section 20.3) |
| Cycle count > 100,000 | Replace K1 |
| TP5 high at idle | Replace the main board (20.6) |
| Aux feedback fault | Replace K1 or the aux harness |
| Short-circuit event in log | Inspect the socket, the cable and vehicle inlet for damage; investigate the cause before returning to service |

> ⚠️ **Never** clear E-02 and return a station to service without replacing the confirmed welded contactor. The error is latched and requires a service reset (Section 15.10).

---

## 15.3 E-03 — CP short-circuit

**What it means.** The control-pilot line is shorted to ground or to another conductor, or the CP waveform is outside the safe window.

**Typical causes**

- Damaged charging cable or vehicle inlet
- Water or contamination in the socket
- Bent or damaged CP pin in the socket
- Damaged harness (pinched during assembly)
- Failed CP driver on the board

**Checks**

1. Unplug the cable. Does E-03 clear within 10 seconds? If yes, the cable, adapter or vehicle is at fault. Try a known-good cable and test adapter.
2. Visually inspect the socket pins, the shutter and the seal. Dry the socket if wet; clean carefully using a dry brush.
3. Isolate the supply. Disconnect **J5**. Measure resistance between the **CP** and **PE** pins on the socket side. Expected: **open circuit** (> 1 MΩ). If low, the socket or harness is shorted.
4. With J5 reconnected and the supply restored, measure CP at **TP6** with an empty socket. Expected: **+12 V DC** (state A). A reading near 0 V indicates a short or a failed driver.
5. If the socket harness is fine and TP6 is low with J5 disconnected, the CP driver on the board has failed.

**Corrective action**

- Replace a damaged cable.
- Replace the socket and harness assembly (Section 20.4) if the pin or harness is faulty.
- Replace the main board (20.6) if the driver has failed.

---

## 15.4 E-04 — Residual DC current

**What it means.** The internal DC residual-current detector (RDC1) measured DC leakage above **6 mA** for longer than 10 s.

> ℹ️ E-04 is **separate from** the external RCD. If the external RCD trips instead, go to Section 17.4.

**Typical causes**

- Insulation fault in the cable or vehicle (DC leakage from the on-board charger)
- Moisture in the socket or on the board
- Fault in a vehicle on-board charger
- Fault in the sensor or its wiring
- Electrical noise from nearby equipment

**Checks**

1. Unplug the vehicle. Does E-04 clear (after a power cycle)? If yes, the cable or vehicle is the likely cause. Try another vehicle.
2. Test the charging cable for insulation: with the cable disconnected from both ends, measure insulation resistance at **500 V DC** between each conductor and PE. Expected: **> 1 MΩ**.
3. With the cable removed, power-cycle the station. If E-04 reappears with an empty socket, inspect for moisture, condensation or contamination on the board and the socket.
4. Check the RDC1 sensor wiring and connector for damage.
5. Test with the **EVSE test adapter** at 16 A. Inject a 6 mA DC leakage. The station should trip with E-04 within 10 seconds. If it does not, the sensor is faulty.

**Corrective action**

- Replace a cable with low insulation resistance.
- Dry the unit and fix the cause of moisture (gland, seals, mounting orientation).
- Replace the main board (20.6) if RDC1 is faulty.
- Advise the user to have the vehicle's on-board charger checked if the problem follows the vehicle.

**Reset.** E-04 requires removing the vehicle and a power cycle (or Clear errors from NordLink) to reset.

---

## 15.5 E-05 — Over-temperature

**What it means.** An internal temperature sensor exceeded **85 °C** (terminal block) or **75 °C** (board). Charging stops until it falls below **65 °C**.

> ℹ️ Warning W-203 appears first, when the temperature passes **70 °C**; the station derates the current before stopping.

**Typical causes**

- Direct sunlight in hot climates
- Loose or corroded terminal (high contact resistance heats the block)
- Undersized supply cable
- Long periods at 32 A in high ambient temperature
- Blocked airflow or a mounting position over a heat source
- Faulty temperature sensor

**Checks**

1. Compare the ambient temperature with the log's 1-minute temperature data (`T_board`, `T_term`, `T_amb`).
2. Isolate and open the unit. **Inspect terminals for discolouration, melting or burn marks.**
3. Re-torque all mains terminals to **2.0 Nm** (see 12.4 for safe isolation).
4. Use a thermal camera under load (with the cover removed only if you can keep clear of live parts; otherwise use the cover-on view at the gland). A terminal > 20 °C hotter than the others indicates a poor connection.
5. Check cable cross-section against current and length (Section 3.3).
6. Check that the sensor reading is plausible: with the unit cold (> 2 hours idle), `T_board` and `T_amb` should be within **±5 °C**. A bigger difference indicates a sensor fault.

**Corrective action**

| Finding | Action |
|---|---|
| Sun-exposed | Fit a shade; move the unit; set maximum current lower |
| Loose terminal | Re-terminate with a new ferrule; replace the terminal block if damaged |
| Undersized cable | Upgrade the supply cable |
| Heat-damaged terminal block | Replace (20.5) and inspect the board |
| Sensor out of range | Replace the main board (20.6) |

**Reduce the heat** as a workaround: set **Maximum charging current** to 24 A until the root cause is fixed.

---

## 15.6 E-06 — Ambient sensor fault

**What it means.** The external ambient temperature sensor does not respond or reads outside −45 °C to +105 °C.

**Checks**

1. Power-cycle the station. Does E-06 return within 60 seconds?
2. Isolate the supply and inspect the sensor connector **J6** and its short harness.
3. Measure sensor resistance at J6: expected **10 kΩ ± 5 % at 25 °C** (NTC). Open circuit or short circuit means a failed sensor.

**Corrective action**

- Reseat or replace the sensor harness.
- Replace the main board (20.6) if the sensor input is faulty.

> ℹ️ Without the ambient sensor, the station cannot derate correctly. Do not bypass.

---

## 15.7 E-07 — Tamper detected

**What it means.** The cover-open switch triggered while the station was powered.

**Checks**

1. Ask the user whether the cover was opened and by whom.
2. Check the log for `EVT 0x3A TAMPER_OPEN` and the timestamp.
3. Inspect the housing and seal for signs of unauthorised access.
4. Check the tamper switch (SW2) for correct seating and wear.

**Corrective action**

- If the opening was legitimate (for example, authorised service), refit the cover correctly, ensure the switch is pressed, and clear the error with a service reset (15.10).
- If unauthorised, inspect all wiring and the board. Document findings for the owner. Reset only after checks.
- Replace the switch or the board if it is mechanically faulty.

---

## 15.8 E-08 — Supply voltage out of range

**What it means.** One or more phase voltages were below **170 V** or above **265 V** for more than 5 s.

**Checks**

1. Measure L–N voltage at TB1 for each phase, **under load** if possible.
2. Compare to the log (`V_L1`, `V_L2`, `V_L3`).
3. Check upstream: main fuse, connections at the meter, neutral integrity.

| Finding | Meaning |
|---|---|
| Low on all phases under load | Voltage drop in the supply; check cable cross-section and length |
| High on one phase and low on another | Lost or poor neutral; **stop and call the utility** |
| Voltage swings with large loads | Weak supply or loose connection upstream |
| Consistently high (> 255 V) | Contact the grid operator |

**Corrective action**

- Correct the installation problem or ask the utility to adjust the supply.
- Lower the maximum charging current if the voltage drops under load.
- If measured voltage is normal and the code persists, replace the main board (20.6).

> ⚠️ Lost-neutral conditions can raise one phase to nearly 400 V. Do not reset the station until the cause is found and repaired.

---

## 15.9 E-09 — Phase loss

**What it means.** One or more phases of a three-phase installation are missing while the station is set to three-phase operation.

**Checks**

1. Measure L1–N, L2–N and L3–N at TB1. All should be ≈ 230 V.
2. Check the upstream breaker and RCD: a tripped pole, a loose terminal or a blown fuse can remove a phase.
3. Check phase wiring at TB1.
4. If measured voltages are correct but E-09 persists, check log events `EVT 0x41 PHASE_L2_LOST`, etc., then check CT wiring.

**Corrective action**

- Repair the supply.
- If the installation is supplied by one phase only, set **Phase configuration** to *Single-phase* in the web interface (General → Charger). Failing to do so causes E-09.
- Replace the main board if voltages are fine and the code persists.

---

## 15.10 Service reset (clearing latched errors)

Some errors latch and cannot be cleared by the user: **E-02, E-07 and E-08 (lost-neutral events)**. A service reset records the technician and reason in the log.

1. Make sure the cause has been repaired.
2. Log in to the web interface as **admin**, open **Backup & FW → Diagnostics → Service reset**.
3. Enter the **service code** provided by Nordvane or your authorised distributor. The code is valid for 24 hours and is tied to the serial number.
4. Click **Clear latched errors**. The station reboots.
5. Run the commissioning test (Section 19).

---

# 16. Warning and Notice Procedures

Warnings do not always stop charging, but they point at problems that should be understood.

| Code | Priority | Recommended first action |
|---|---|---|
| W-201 | Low | Complete first-use setup |
| W-202 | Info | Verify dry-contact input status (16.2) |
| W-203 | Medium | See 15.5 — treat as a pre-warning for E-05 |
| W-204 | Medium | See 16.3 |
| W-205 / W-206 | Medium | See 16.4 |
| W-207 | Medium | See 16.5 |
| W-208 | Info | Expected when load-control input is active (16.2) |
| W-209 | Low | Inverter-side; check inverter cooling |
| W-210 / W-211 / W-212 | Medium | See 16.6 |
| W-213 | Low | See 16.7 |
| W-214 | Low | See 16.8 |

## 16.1 W-201 — Initial setup not completed

Run first-use setup (Section 5.1 or 5.2). If the wizard keeps returning to the beginning after Save, perform a full reset (5.8), re-run setup, and check that the firmware is current.

## 16.2 W-202 and W-208 — Grid-operator block / external current limit

**Purpose.** The station reacts to the dry-contact input at J4 (DI-1 and DI-GND).

**Checks**

1. In the web interface, open **General → Charger → Load-control input** and check whether the input is *Enabled* and the logic polarity.
2. With the supply isolated, measure the contact at J4. Expected: **open circuit** when no limit is requested; **< 100 Ω** when closed.
3. Disconnect the external wiring and fit a link or leave open to test the station's response.
4. If W-208 appears without a signal, look for a damaged control cable, moisture in the gland, or interference from nearby mains wiring.
5. If the grid operator is actually sending the signal, no repair is needed. W-202 and W-208 clear when the signal ends.

**Corrective action.** Re-route or replace the control cable; use screened cable and keep 100 mm or more away from mains conductors.

## 16.3 W-204 — Hub communication warning

**Procedure**

1. Check that the Hub is on and online.
2. In the ArcPort web interface, open **General → Hub** and press **Check**.
3. Compare the stored IP address and Portal ID with the values shown on the Hub.
4. Ping the Hub from a laptop on the same network. If it fails, fix the network.
5. If the Hub's IP address changed, assign a fixed DHCP lease and press **Discover**.
6. Check the Hub's paired-devices list. If the ArcPort is missing, re-pair (Section 5.3).
7. If using Modbus TCP, confirm the whitelist includes the Hub's address and that the Modbus server is enabled on the Hub.
8. Check Wi-Fi signal (< –75 dBm causes dropouts).

If all of this is correct and W-204 persists, export the log and look for `EVT 0x52 MQTT_AUTH_FAIL` (token invalid: unpair and re-pair) or `EVT 0x53 MQTT_TLS_FAIL` (time not synchronised or certificate problem: check date/time on both devices).

## 16.4 W-205 and W-206 — Overload detected / active

**What happens.** When an overload is reported, the station drops to minimum current, waits about 5 seconds and, if the overload remains, stops charging. A repeated overload reduces maximum current by 10 %.

**Checks**

1. Identify the source: inverter overload, grid import limit, or main breaker limit.
2. Check the Hub for a *Grid import limit* or *Inverter overload* alarm.
3. Examine household loads that coincide with charging (ovens, heat pumps, water heaters).
4. Review the log for `EVT 0x61 OVERLOAD_SET` and `EVT 0x62 OVERLOAD_CLR` to see the time pattern.

**Corrective action**

- Lower the station's maximum charging current.
- Increase the supply capacity or the inverter size.
- Use load management with the Hub so that other large loads pause during charging.
- To restore full current after repeated overloads, reset the reduction in **General → Charger → Reset current limit**.

## 16.5 W-207 — Scheduled mode failed (time sync)

1. Check that the station has internet or a Hub providing time. The station gets time from the Hub, then NTP.
2. Verify date, time zone and region (Settings → General → Date & Time).
3. For stations without internet, set the clock manually. After a power outage, the clock may reset (W-214).
4. Check the log for `EVT 0x70 TIME_SYNC_FAIL`.
5. Make sure your firewall allows outbound UDP port 123.

## 16.6 W-210, W-211, W-212 — Display firmware

**W-212** is normal during a display update; do not remove power. It normally ends within 3 minutes.

**W-210** (broken file): re-download the firmware package, verify its checksum and repeat the update.

**W-211** (communication): isolate the supply and check the display ribbon cable at **J2**. Reseat it carefully, lifting the latch fully before removing the cable. Replace the ribbon if it shows damage. If the fault remains, replace the display board (Section 20.2).

## 16.7 W-213 — Wi-Fi signal weak

1. Check the Wi-Fi status screen for RSSI (aim for better than –70 dBm).
2. Move the router, add an access point or fit an external antenna kit (NV-ANT-01).
3. Avoid 2.4 GHz channels with heavy interference; set the router to channel 1, 6 or 11.
4. Don't mount the station behind metal sheets or in a closed metal box.

## 16.8 W-214 — Clock reset

The internal backup cell has lost charge or the unit was disconnected for a long time. The clock should recover on the next time sync. If W-214 appears after every power cycle, the backup cell (CR1220) needs replacing (Section 20.7).

## 16.9 Notices (N-401 to N-408)

Notices do not indicate faults. They are the station's response to a command that cannot be carried out. See the table in Section 6.5. Technicians should check these causes when a user reports "the button does nothing":

| Notice | Most common root cause |
|---|---|
| N-401 | Hub not paired, or communication disabled |
| N-402 | No enabled schedule |
| N-403 | Vehicle not detected: check CP (Section 18.1) |
| N-404 | An error is active |
| N-407 | Overload active (16.4) |
| N-408 | Display firmware update in progress |

---

# 17. Symptom-Based Troubleshooting

Use this section when there is no code or several possible causes.

## 17.1 Station has no power (display off, ring off, all LEDs off)

| Step | Check | Expected | If not |
|---|---|---|---|
| 1 | Upstream breaker and RCD | ON | Reset once; if it trips again, see 17.4 |
| 2 | Voltage at TB1 (L1–N) | 207–253 V | Repair supply |
| 3 | Fuse F1 | Continuity | Replace with T 500 mA, investigate cause |
| 4 | TP1 (+12 V) | 11.4–12.6 V | Replace PSU / board |
| 5 | TP3 (+5 V) and TP4 (+3.3 V) | In tolerance | Replace the board |

## 17.2 Vehicle connected but station shows "Disconnected"

1. Try another cable and vehicle.
2. Look for dirt or damage in the socket.
3. Measure CP at TP6 with the vehicle connected. Expected: **+9 V** peak (state B). If it stays at +12 V, the vehicle or cable is not pulling the CP down; check the cable's CP wire and the vehicle inlet.
4. Verify Auto-CP calibration (Section 6.1). If still wrong, re-enable manual calibration and run it.
5. Measure PP resistance (Section 18.2). A wrong value changes the cable current limit.
6. If CP is correct and the station still does not recognise the state, replace the main board.

## 17.3 Vehicle detected but charging does not start

| Check | Where | Notes |
|---|---|---|
| Mode and Start state | Overview | Manual needs Start; Solar needs surplus; Scheduled needs an active schedule |
| Autostart | General | Disabled means Start is needed |
| N-codes | Overview | N-403…N-408 point to causes |
| Vehicle charging limit | In the vehicle | Many vehicles have their own schedule or limit |
| CP state | TP6 | Expect +6 V with PWM when the vehicle is ready (state C) |
| Contactor | Listen for a click; TP5 ≈ 11.5 V | No click and TP5 high: check coil fuse F2 and K1 |

If CP shows state C and TP5 is energised but there is no output voltage at the socket, K1 has failed open. Replace K1 (Section 20.3).

## 17.4 External RCD trips

> ⚠️ Do not repeatedly reset a tripping RCD. Find the cause first.

| Observation | Probable cause | Action |
|---|---|---|
| Trips immediately when the supply is switched on, no vehicle | Moisture, damaged cable insulation, wiring fault | Isolate; measure insulation resistance of the supply cable and the station at 500 V DC. Expect > 1 MΩ. |
| Trips when a vehicle is plugged in | Vehicle or cable leakage | Test with another vehicle/cable |
| Trips after a delay while charging | Leakage in vehicle, cumulative leakage, or wrong RCD type | Check RCD type. Type A RCDs can be blinded by DC leakage; use type B or an RCD with 6 mA DC detection |
| Trips only in rain | Water ingress | Check gland, seal and mounting |
| Trips when another large load starts | Combined leakage on the same RCD | Put the station on a dedicated RCD |

**Measure** the leakage current with a clamp-type leakage meter on L+N together, with the vehicle charging. A reading over 15 mA (for a 30 mA RCD) suggests a problem.

## 17.5 Charging is slower than expected

1. Read the actual current with a clamp meter on each phase.
2. Compare it with: the configured maximum, the cable limit (PP resistor), the vehicle's limit, Hub-imposed limits (W-205/W-208/W-209) and thermal derating (W-203).
3. Check the supply voltage under load (a low voltage reduces the power).
4. Check that the vehicle is using all three phases. Some vehicles are single-phase only (7.4 kW max).
5. Check the vehicle's own charging limit and battery temperature (cold batteries charge more slowly).

| Measured vs. expected | Likely cause |
|---|---|
| Matches vehicle on-board charger limit | Normal |
| Lower than the cable limit | Station limit or Hub limit |
| One phase low | Poor terminal or phase imbalance |
| Falls over time | Thermal derating (W-203) |

## 17.6 Charging starts and stops repeatedly

- **Solar mode:** enable *Allow battery/grid power* and *Smooth-start hold*, and raise the stop delay.
- **Manual/Scheduled:** run CP calibration (Section 6.1). Replace the cable if the CP waveform shows noise (Section 18.1).
- **Wi-Fi/Hub related:** check W-204.
- **Chattering contactor:** low supply voltage can make the contactor drop out. Measure at TB1 under load.

## 17.7 Supply problems that appear as station faults

- Voltage drop of more than 5 % at full load: upgrade the cable.
- Neutral-to-earth voltage above 5 V under load: check neutral integrity.
- Noisy supply (harmonics/spikes) from inverters or large motors: add filtering or separate circuits.

## 17.8 Display problems

| Symptom | Check |
|---|---|
| Blank display, ring works | Ribbon cable at J2; backlight; display update status |
| Display flickers | Ribbon cable; PSU ripple at TP1 (< 100 mV p-p) |
| Touch unresponsive | Display lock setting; calibrate touch (Settings → Touch); clean glass |
| Wrong language or time | Settings → Language; time zone |
| Ghost touches in rain | Enable "Rain mode" in Display settings |

## 17.9 Light ring problems

| Symptom | Check |
|---|---|
| Ring dark | Brightness limit set to 0; J3 connector; LED driver supply |
| Wrong colours | Light-ring scenes; import default scenes |
| Random flicker | J3 connector and ground; check TP1 ripple |
| Only part of ring lights | Damaged LED strip; replace ring (20.8) |

## 17.10 Bluetooth and NordLink problems

1. Verify Bluetooth is enabled (web: Network → Bluetooth).
2. Remove old pairings on the phone; use *Unpair all devices* and pair again.
3. Check pairing code (000000 or the internal label).
4. Stay within 5 m with no metal between phone and station.
5. Update NordLink and the phone's OS.

---

## 17.11 Overheating — detailed service diagnosis

Use this procedure for W-203, E-05, or a customer complaint of "hot station", "slow charging in summer" or "burning smell". It complements Section 15.5.

> ⚠️ **If there are signs of burning, melted plastic, smoke or arcing:** isolate the supply at the distribution board immediately, apply lock-out, and do not re-energise until the cause is found and any damaged parts are replaced.

### 17.11.1 Gather evidence

1. Export the diagnostic log (Section 14.2). Look at `T_board`, `T_term`, `T_amb`, current and voltage for the 72 hours before the event.
2. Note the time of day, the charging current and the weather. Does the pattern follow sun exposure or only high current?
3. Ask when the problem started and whether anything changed (new vehicle, higher current, new cable, season).
4. Inspect the site: sun exposure, clearances, nearby heat sources, cable routing.

### 17.11.2 Classify the problem

| Log pattern | Probable class | Go to |
|---|---|---|
| `T_board` and `T_term` rise with `T_amb`, even at low current | Environmental | 17.11.3 |
| `T_term` rises much faster than `T_board` under load | High-resistance connection | 17.11.4 |
| `T_board` high with idle current | Electronics / PSU / sensor | 17.11.5 |
| One phase's terminal hotter than others | Phase connection or imbalance | 17.11.4 |
| Sensor reading disagrees with ambient after cooling | Faulty sensor | 17.11.6 |
| Temperature normal, but the cable or plug is hot | Cable / vehicle inlet | 17.11.7 |

### 17.11.3 Environmental overheating

1. Measure the ambient temperature at the station and the housing surface temperature (infrared thermometer) in the sun and in the shade.
2. Compare with the derating guidance in Section 6.7.5.
3. Check clearances (200 mm sides, 300 mm below) and any enclosure.
4. Look for reflected heat (glass, metal cladding), flues or exhausts.

**Actions:** fit a sun shield (leave a 30 mm air gap behind it), relocate if needed, reduce the maximum current, and add a night-time schedule. Document the changes.

### 17.11.4 High-resistance connection (hot terminals)

> ⚠️ A hot terminal is a fire risk. Treat it as urgent.

1. Under load (32 A if possible), scan the **gland area and the lower front housing** with a thermal camera without opening the unit. A hot spot near the terminals confirms a problem.
2. Isolate and prove dead (Section 12.4). Open the unit.
3. Inspect TB1 for **discolouration, melted insulation, brown or black marks, pitting** or a smell of burning.
4. Check ferrules: crimps should be tight, undamaged and the correct size. Stranded conductors without ferrules often loosen.
5. Check that the conductor is fully inserted and that no insulation is trapped under the clamp.
6. Re-torque every terminal to **2.0 Nm** and pull-test each conductor.
7. Measure voltage drop across each terminal under load: it should be **< 20 mV** at 32 A. A reading of 50 mV or more suggests a bad contact.

| Finding | Action |
|---|---|
| Loose but undamaged | Re-terminate with a new ferrule, re-torque, re-test |
| Discoloured metal or insulation | Replace the terminal block (20.5) and the conductor end; inspect the board |
| Melted plastic nearby | Replace the terminal block and check adjacent parts; inspect the main board for heat damage |
| Board marks or burnt tracks | Replace the main board (20.6) |

### 17.11.5 Internal electronics running hot

1. With the vehicle unplugged, record `T_board` at idle. It should be within **ambient + 8 °C**.
2. Measure the PSU rails at TP1, TP3 and TP4 and ripple at TP1 (< 100 mV peak-to-peak).
3. Check the contactor coil drive (TP5) at idle. It should be 0 V. If the coil is energised without a vehicle, the coil heats the area and the contactor may fail early (see 15.2).
4. Look for dust, insects, water marks or corrosion on the board.

| Finding | Action |
|---|---|
| Idle temperature high, rails normal | Replace the main board |
| Rails out of tolerance or high ripple | Replace the main board |
| Coil energised at idle | Replace the main board; check K1 |
| Water or corrosion | Find the entry route (gland, seal, socket), dry and clean, replace affected parts |

### 17.11.6 Temperature sensor check

1. Leave the unit unpowered for at least **2 hours** so that all parts reach ambient temperature.
2. Power the station and read `T_board`, `T_term` and `T_amb` immediately.
3. Compare each with a reference thermometer. Differences of **more than 5 °C** indicate a sensor fault.
4. For the ambient sensor, measure resistance at J6 (10 kΩ ± 5 % at 25 °C). Also see E-06 (15.6).

If a sensor reads too high, replace the board. If it reads too low, **do not leave the station in service**: the protection would act too late. Replace the board immediately.

### 17.11.7 Hot cable or plug

1. Compare the temperature of the plug at the station and at the vehicle after 30 minutes of charging.
2. Check the PP resistor value of the cable (Section 18.2) and the cable's rating against the charging current.
3. Look for burned or discoloured pins, deformed plastic, loose contacts or damaged strain relief.
4. Replace the cable if its temperature rises more than **25 °C above ambient** at its rated current, or if any damage is visible.
5. If the vehicle inlet is hot, reduce the current and advise the user to have the vehicle checked.

### 17.11.8 After the repair: verification

1. Run a **2-hour soak test** at the customer's normal maximum current, with the cover on.
2. Log `T_board` and `T_term`. Expected stable values are in Section 18.5.
3. Re-scan with the thermal camera. No terminal or surface should be more than **35 °C above ambient**.
4. Confirm that W-203 and E-05 no longer appear.
5. Record the results in the service record.

### 17.11.9 Advice to leave with the customer

- Keep the station shaded, uncovered and clear.
- Lower the maximum current in very hot weather.
- Never use extension leads.
- If the station ever smells of burning, switch off the breaker and call an electrician.
- Have the terminals checked at the next periodic inspection.

---

# 18. Reference Measurements and Expected Values

## 18.1 Control pilot (CP) states and waveform

CP is a ±12 V, 1 kHz signal. The positive-peak voltage tells the station the vehicle state; the duty cycle tells the vehicle the available current.

| State | Meaning | CP positive peak | PWM |
|---|---|---|---|
| A | No vehicle | +12 V (DC, no PWM) | None |
| B | Vehicle connected, not ready | +9 V ± 1 V | Yes, when enabled |
| C | Vehicle ready, charging | +6 V ± 1 V | Yes |
| D | Ventilation required | +3 V ± 1 V | Not supported — station will fault |
| E | Error / short to earth | 0 V | None |
| F | Station unavailable | −12 V | None |

The negative peak should be **−12 V ± 0.8 V** in states B and C. A negative peak close to 0 V indicates the vehicle's diode is missing or a cable fault.

**Duty cycle to current**

| Duty cycle | Available current |
|---|---|
| 10 % | 6 A |
| 16.7 % | 10 A |
| 26.7 % | 16 A |
| 40 % | 24 A |
| 53.3 % | 32 A |

Formula: *I (A) = duty (%) × 0.6* for duty between 10 % and 85 %.

**Waveform quality.** Rise and fall times should be < 3 µs. Ringing or noise of more than ±0.5 V on the plateau points to a defective cable or interference.

## 18.2 Proximity pilot (PP) cable coding

The PP resistor in the cable plug tells the station what current the cable can carry.

| PP resistance | Cable rating |
|---|---|
| 1.5 kΩ ± 3 % | 13 A |
| 680 Ω ± 3 % | 20 A |
| 220 Ω ± 3 % | 32 A |
| 100 Ω ± 3 % | 63 A |

Measure at the cable's plug (PP to PE) with the cable disconnected. Replace a cable if the reading is far from these values.

## 18.3 Supply and insulation values

| Test | Expected |
|---|---|
| Supply voltage L–N | 207–253 V (nominal 230 V) |
| Supply voltage L–L | 360–440 V (nominal 400 V) |
| N–PE voltage | < 2 V unloaded; < 5 V under load |
| Earth-loop impedance Zs | < 1.0 Ω (TN), see local rules |
| Insulation resistance, supply cable (500 V DC) | > 1 MΩ |
| Insulation resistance, station (disconnected supply, between all live conductors and PE, 500 V DC) | > 1 MΩ |
| Protective-earth continuity | < 0.5 Ω |
| External RCD trip time at 1 × IΔn | < 300 ms |
| External RCD trip time at 5 × IΔn | < 40 ms |

> ⚠️ Disconnect the station's mains terminals before performing a 500 V insulation test on the supply cable. Do not apply a 500 V test across the station electronics.

## 18.4 Terminal torque values

| Connection | Torque |
|---|---|
| Mains terminals TB1 | 2.0 Nm |
| Dry-contact terminals J4 | 0.4 Nm |
| Backing-plate screws | 1.0–1.2 Nm |
| Cable gland nut | 3.0 Nm |
| Wall-mount screws | Firm; do not overtighten |
| Display board screws | 0.4 Nm |

## 18.5 Internal sensor reference

| Parameter | Normal range |
|---|---|
| Board temperature at idle | Ambient + 3 to 8 °C |
| Board temperature at 32 A, 3-phase | Ambient + 15 to 30 °C |
| Terminal temperature at 32 A | Ambient + 20 to 35 °C |
| Derating start (W-203) | 70 °C |
| Stop (E-05) | 75 °C board / 85 °C terminals |
| Resume | 65 °C |
| Current measurement accuracy | ± 1.5 % |
| Power calibration factor (default) | 1.00 |

---

# 19. Commissioning and Periodic Inspection Test Procedure

Perform this test after installation, after any repair, and during periodic inspections (every 24 months or as required locally).

## 19.1 Dead tests (supply isolated)

| # | Test | Acceptable result | Result |
|---|---|---|---|
| 1 | Visual inspection: housing, seals, gland, cable, socket | No damage | ☐ |
| 2 | Terminal torque check | 2.0 Nm | ☐ |
| 3 | PE continuity (R2) | < 0.5 Ω | ☐ |
| 4 | Insulation resistance, supply cable, 500 V DC | > 1 MΩ | ☐ |
| 5 | Polarity / phase sequence (3-phase) | L1-L2-L3 correct | ☐ |

## 19.2 Live tests (supply on)

| # | Test | Acceptable result | Result |
|---|---|---|---|
| 6 | Supply voltage L–N (each phase) | 207–253 V | ☐ |
| 7 | N–PE voltage | < 2 V | ☐ |
| 8 | Earth-loop impedance Zs | < 1.0 Ω or per local rules | ☐ |
| 9 | External RCD test at 1 × IΔn | Trips < 300 ms | ☐ |
| 10 | External RCD test at 5 × IΔn | Trips < 40 ms | ☐ |
| 11 | Service LEDs | LED1 flashing, no red | ☐ |
| 12 | Test points TP1/TP3/TP4 | In tolerance | ☐ |

## 19.3 Functional tests with EVSE test adapter

| # | Test | Acceptable result | Result |
|---|---|---|---|
| 13 | State A (no vehicle) | CP +12 V; ring "Disconnected" | ☐ |
| 14 | State B (connected) | CP +9 V; ring "Connected" | ☐ |
| 15 | State C (charging) at 16 A | Contactor closes; output voltage present; current within ±1.5 % | ☐ |
| 16 | State C at 32 A | As above | ☐ |
| 17 | Stop command | Current drops, contactor opens after ~2 s | ☐ |
| 18 | State E (CP shorted to PE) | Contactor opens; E-03 | ☐ |
| 19 | Ground fault (open PE test, if the adapter supports it) | E-01; no output | ☐ |
| 20 | 6 mA DC leakage injection | E-04 within 10 s | ☐ |
| 21 | Cover-open (power on, then open cover) | E-07 | ☐ |
| 22 | Dry-contact input closed | Current limited; W-208 | ☐ |

## 19.4 Functional tests with a real vehicle

| # | Test | Acceptable result | Result |
|---|---|---|---|
| 23 | Plug in and start in Manual | Charging begins; correct current | ☐ |
| 24 | Stop and unplug | Clean stop; ring returns to disconnected | ☐ |
| 25 | Scheduled mode (short test schedule) | Starts and stops at the correct times | ☐ |
| 26 | Solar mode (if Hub fitted) | Starts with surplus; stops without | ☐ |
| 27 | NordLink: connect and control | Works | ☐ |
| 28 | NordCloud: view and control | Works | ☐ |

## 19.5 Handover

- Set the final **maximum charging current** and **phase configuration**.
- Change the default web password.
- Record the Wi-Fi password and pairing code (or give them to the customer).
- Show the customer how to read the ring and the touchscreen.
- Provide the test sheet to the customer and keep a copy.

---

# 20. Component Replacement Procedures

> ⚠️ Isolate and prove dead (Section 12.4) before every procedure. Wear an ESD strap when handling boards. Photograph connections before disconnecting. Fit new seals whenever a seal is disturbed.

## 20.1 Spare parts list

| Part no. | Description | Used in |
|---|---|---|
| NV-AP22-SP01 | Main control board (with firmware) | 20.6 |
| NV-AP22-SP02 | Display board with touch panel | 20.2 |
| NV-AP22-SP03 | Contactor K1, 4-pole, 40 A | 20.3 |
| NV-AP22-SP04 | Type 2 socket with harness (J5) | 20.4 |
| NV-AP22-SP05 | Terminal block TB1 assembly | 20.5 |
| NV-AP22-SP06 | Halo LED ring with harness | 20.8 |
| NV-AP22-SP07 | Backing-plate seal kit | All |
| NV-AP22-SP08 | Gland kit (25 mm) | Gland |
| NV-AP22-SP09 | Fuse kit (F1, F2) | 20.9 |
| NV-AP22-SP10 | Backup cell CR1220 | 20.7 |
| NV-ANT-01 | External Wi-Fi antenna kit | 16.7 |

## 20.2 Display board

1. Isolate and remove the backing plate.
2. Lift the latch on **J2** and carefully pull out the ribbon.
3. Remove the 4 screws (0.4 Nm) holding the display board.
4. Fit the new board, reconnect the ribbon (latch down) and tighten the screws.
5. Restore power. The display should light up and may self-update (W-212). Wait until it completes.
6. Run tests 13–17 in Section 19.

## 20.3 Contactor K1

1. Isolate and prove dead. Photograph all wiring.
2. Label and disconnect the 4 input conductors and 4 output conductors.
3. Disconnect the coil connector and the aux-contact connector.
4. Release the DIN clip or screws and remove K1.
5. Fit the new contactor. Reconnect input and output in the **same order as photographed**.
6. Torque power connections to **2.0 Nm**.
7. Record the replacement in the log (**Diagnostics → Service reset → Log service event: contactor replaced**) so the cycle counter resets.
8. Perform a service reset if E-02 was latched (15.10).
9. Run the full commissioning test (Section 19).

## 20.4 Type 2 socket and harness

1. Isolate and remove the backing plate.
2. Disconnect **J5**, and the L1–L3, N, PE power leads from the socket terminals (note positions).
3. Unscrew the socket retaining screws from the front housing (security Torx T20).
4. Remove the old socket and inspect the housing seal.
5. Fit the new socket with a new gasket; torque the screws to 1.0 Nm.
6. Reconnect the harness and power leads. Make sure the socket lock motor connector is seated.
7. Test the lock: plug in the test adapter, then start charging. The lock should engage. Stop charging and the lock should release.
8. Run tests 13–22 in Section 19.

## 20.5 Terminal block TB1

1. Isolate and prove dead. Photograph the conductors and their positions.
2. Release all supply conductors and the internal links.
3. Remove the 2 mounting screws and the terminal block.
4. Fit the new block, reconnect the internal links, then the supply conductors with **new ferrules**.
5. Torque to **2.0 Nm** and pull-test each conductor.
6. Run Section 19 dead and live tests.

## 20.6 Main control board

> ⚠️ This is the most complex replacement. Always confirm that the fault is not in the supply, cable, vehicle or one of the cheaper parts first.

1. **Back up the settings** (web: Backup & FW → Backup; or NordLink: ⋮ → Save settings).
2. Export the diagnostic log (Section 14.2).
3. Isolate and prove dead. Photograph the board and every connector.
4. Disconnect all connectors: **J2** (display), **J3** (ring), **J4** (dry-contact), **J5** (socket), **J6** (ambient sensor), the contactor connectors, and the CT harnesses.
5. Disconnect the mains conductors from the board terminals (if the board carries power terminals on your revision).
6. Remove the board mounting screws.
7. Fit the new board, using ESD precautions.
8. Reconnect everything and torque the terminals.
9. Restore power. The new board will start in first-use setup mode. Run first-use setup (Section 5.1 or 5.2).
10. **Restore settings** from the backup (Backup & FW → Restore).
11. Re-pair with the Hub if required.
12. Copy the station's serial number to the new board: **Diagnostics → Service → Write serial** (requires a service code).
13. Run the full commissioning test (Section 19).

## 20.7 Backup cell

1. Isolate and remove the backing plate.
2. Gently lift the CR1220 cell from its holder using a plastic spudger.
3. Fit a new cell, positive side up.
4. Restore power and set the date and time.

## 20.8 Halo LED ring

1. Isolate; remove the backing plate and the front cover (8 security Torx screws).
2. Disconnect **J3**.
3. Lift the ring out of the front moulding.
4. Fit the new ring, with the connector in the same position.
5. Reassemble with a new front seal. Torque the screws to 1.0 Nm.
6. Test every scene with *Try this scene*.

## 20.9 Fuses F1 and F2

1. Isolate and prove dead.
2. Pull out the fuse with an insulated tool.
3. **Only replace with the stated rating** — F1: T 500 mA / 250 V; F2: T 1 A / 250 V.
4. If the fuse blows again, do not replace it a second time: look for a short circuit in the corresponding circuit (F1: board or PSU; F2: contactor coil or driver).

## 20.10 Closing up after any repair

- [ ] All connectors seated and latched
- [ ] No tools or debris left inside
- [ ] All terminals torqued
- [ ] Seals clean, undamaged and correctly located
- [ ] Gland tight (3.0 Nm)
- [ ] Backing plate screws at 1.0–1.2 Nm in a cross pattern
- [ ] Commissioning tests passed (Section 19)

---

# 21. Diagnostic Log and Event Code Reference

The diagnostic log (`.nvlog`) stores timestamped events in the format:

```
2026-10-02T14:31:07Z  EVT 0x21  RELAY_STICK   L=ERR  v=1  a=0  ctx=K1
```

Fields: timestamp (UTC), event ID, name, level (INFO / WARN / ERR), values, and context.

## 21.1 Event codes

| Event ID | Name | Level | Linked codes | Meaning |
|---|---|---|---|---|
| 0x01 | BOOT | INFO | – | Station started; includes reset reason |
| 0x02 | WDT_RESET | ERR | – | Watchdog reset. Repeated events suggest a board or PSU fault |
| 0x03 | BROWNOUT | WARN | E-08 | Supply dipped below the brown-out level |
| 0x10 | CP_STATE_CHG | INFO | – | CP state changed (A–F) |
| 0x11 | CP_SHORT | ERR | E-03 | CP short detected |
| 0x12 | CP_DIODE_FAIL | WARN | – | Negative CP peak out of range (vehicle diode or cable problem) |
| 0x13 | PP_INVALID | WARN | – | PP resistance outside table in 18.2 |
| 0x20 | RELAY_CLOSE | INFO | – | K1 closed |
| 0x21 | RELAY_STICK | ERR | E-02 | K1 did not open on command |
| 0x22 | RELAY_NO_CLOSE | ERR | – | K1 did not close on command (check F2, coil) |
| 0x23 | RELAY_CYCLES | INFO | – | Contactor cycle count milestone |
| 0x30 | PE_LOST | ERR | E-01 | Earth monitoring failed |
| 0x31 | RDC_TRIP | ERR | E-04 | DC residual current above 6 mA |
| 0x32 | OVERTEMP_WARN | WARN | W-203 | Derating started |
| 0x33 | OVERTEMP_TRIP | ERR | E-05 | Over-temperature stop |
| 0x34 | AMB_SENS_FAIL | ERR | E-06 | Ambient sensor fault |
| 0x3A | TAMPER_OPEN | ERR | E-07 | Cover opened while powered |
| 0x40 | V_RANGE | ERR | E-08 | Voltage out of range |
| 0x41 | PHASE_LOST | ERR | E-09 | Phase loss (context shows phase) |
| 0x50 | MQTT_CONNECT | INFO | – | Connected to the Hub |
| 0x51 | MQTT_LOST | WARN | W-204 | Connection to the Hub lost |
| 0x52 | MQTT_AUTH_FAIL | WARN | W-204 | Authentication refused — re-pair |
| 0x53 | MQTT_TLS_FAIL | WARN | W-204 | TLS failure (check clock) |
| 0x54 | MODBUS_CLIENT_REJ | INFO | – | Client rejected by whitelist |
| 0x60 | LOADCTRL_ON | INFO | W-208 | Dry-contact input active |
| 0x61 | OVERLOAD_SET | WARN | W-205/206 | Overload started |
| 0x62 | OVERLOAD_CLR | INFO | – | Overload ended |
| 0x63 | CURRENT_DERATE | WARN | – | Maximum current reduced by 10 % |
| 0x70 | TIME_SYNC_FAIL | WARN | W-207 | Time could not be synchronised |
| 0x71 | CLOCK_RESET | WARN | W-214 | Clock reset |
| 0x80 | FW_UPDATE_START | INFO | – | Firmware update started |
| 0x81 | FW_UPDATE_OK | INFO | – | Update completed |
| 0x82 | FW_UPDATE_FAIL | ERR | – | Update failed (reason in context) |
| 0x90 | SERVICE_RESET | INFO | – | Latched errors cleared by a technician |
| 0x91 | SERVICE_EVENT | INFO | – | Service note entered (for example, part replaced) |

## 21.2 Reading patterns in the log

| Pattern | Interpretation |
|---|---|
| `WDT_RESET` several times a day | Unstable supply, PSU fault or board failure |
| `BROWNOUT` shortly before `WDT_RESET` | Supply problem |
| `CP_STATE_CHG` toggling B↔C every few seconds | Cable, calibration or vehicle problem |
| `RELAY_CLOSE` count rising rapidly | Frequent start/stop (Solar mode settings, vehicle behaviour) |
| `OVERTEMP_WARN` always at the same time of day | Sun exposure |
| `MQTT_LOST` followed by `MQTT_CONNECT` repeatedly | Weak Wi-Fi or router problem |
| `TAMPER_OPEN` with no service record | Unauthorised access |

---

# 22. Service Record Templates

## 22.1 Service call record

```
SERVICE CALL RECORD — ArcPort Home 22
-----------------------------------------------------------
Date: ____________   Technician: ______________________
Company: ________________________   Cert. no.: __________

Customer / site: __________________________________________
Station serial no.: _________________   Model: ☐ AP22  ☐ AP22-NS
Firmware version: ____________   NordLink version: ________
Installation date: ____________   Supply: ☐ 1-ph  ☐ 3-ph
Earthing system: ☐ TN-S  ☐ TN-C-S  ☐ TT

REPORTED PROBLEM
__________________________________________________________
__________________________________________________________

CODES FOUND:  ☐ E-__  ☐ W-___  ☐ N-___
First seen: ____________   Log exported: ☐ Yes  ☐ No

TESTS CARRIED OUT (Section 14/15/16 reference)
Supply voltage L1: ____ V  L2: ____ V  L3: ____ V
N–PE voltage: ____ V      Zs: ____ Ω
Insulation resistance: ____ MΩ     PE continuity: ____ Ω
CP state / voltage: ____________    PP resistance: ____ Ω
Other: ____________________________________________________

CAUSE FOUND
__________________________________________________________

ACTION TAKEN / PARTS REPLACED (part no. / serial)
__________________________________________________________
__________________________________________________________

COMMISSIONING TEST (Section 19) PASSED:  ☐ Yes  ☐ No
Service reset performed: ☐ Yes  ☐ No   Code ref: _________

Customer informed of: ☐ cause  ☐ advice  ☐ further work

Signed (technician): ________________   Date: ___________
Signed (customer): __________________   Date: ___________
```

## 22.2 Warranty return checklist

Before returning a defective station or part under warranty, confirm:

- [ ] Original proof of purchase attached
- [ ] Installation certificate or installer details attached
- [ ] Completed service call record attached
- [ ] Diagnostic log (`.nvlog`) attached
- [ ] Photographs of the installation and the fault attached
- [ ] Settings backup taken and personal data removed with a full factory reset (if the unit is still operable)
- [ ] Returns authorisation number (RMA) obtained from Nordvane
- [ ] Packed in the original packaging with the socket cover closed

## 22.3 Quick reference — error codes at a glance

| Code | First thing to check | Most common fix |
|---|---|---|
| E-01 | PE continuity at TB1 | Repair earth connection |
| E-02 | Continuity across K1 (isolated) | Replace contactor |
| E-03 | Try another cable; inspect socket | Replace cable / socket |
| E-04 | Try another vehicle/cable; insulation test | Replace cable; dry unit |
| E-05 | Sun exposure; terminal torque | Shade; re-terminate |
| E-06 | Sensor connector J6 | Reseat / replace |
| E-07 | Cover seating, switch SW2 | Refit cover; service reset |
| E-08 | Voltage at TB1 under load | Fix supply |
| E-09 | Voltage on all phases | Fix supply or set 1-phase |
| W-203 | Temperature log | Shade; reduce current |
| W-204 | Hub IP / Portal ID | Re-pair |
| W-205/206 | Inverter / grid limit | Lower current; load management |
| W-207 | Date/time/internet | Fix time sync |
| W-208 | Dry-contact state | Expected if operator signal |

---

*© 2026 Nordvane Energy (fictional). All rights reserved. Specifications are subject to change without notice. Always use the latest version of this manual.*
