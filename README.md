RaspberryCar - Remote controlled car controller software
--------------------------------------------------------

# Features
- Drive an R/C car with speed and steering control
- Turn on/off front, back, engine lights, laser beams, etc
- Engine rumbling
- Horn
- Angry meowing to scare the cat

# Hardware:
- An existing R/C car with motors
- Raspberry PI model 3
- 1x L298n module
- 1x PCA9685 module
- 3x red LED lights
- 2x white LED lights
- 1x USB speaker
- 8x AA batteries 1.2V 2500mAh
- 1x 5V usb power bank
- wires
		
# Software
- node.js
- socket.io
- rxjs

Software Setup
--------------
Clone project, install Node.js 8.x or higher and necessary packages
```bash
git clone git://github.com/dariomannu/RaspberryCar.git

cd RaspberryCar

yarn
```

GPIO access still requires root access
```bash
yarn start

```

