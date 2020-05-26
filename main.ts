//% weight=10 icon="\uf085" color=#FFA400 block="m-robo"
namespace robo_test {
    let a = 0;
    let Value: number[] = []
    let Saturation: number[] = []
    let Hue: number[] = []
    let Color = "NULL"
    let Color_L = "NULL"
    let Color_R = "NULL"
    let border = 125
    Hue = [0, 0, 0]
    Saturation = [0, 0, 0]
    Value = [0, 0, 0]

    //% blockId=plus block="plus %v"
    export function plus() {
        a = 1 + 1;
    }

    //% blockId=answer block="answer %v"
    export function answer() {
        return (a);
    }

    //% blockId=double block="2倍 %v"
    export function double(b: number) {
        return (b * 2);
    }

    //% blockId=Ultrasonic block="Ultrasonic %v"
    export function Ultrasonic(address: number) {
        // Resets data
        let DataL = 0;
        let DataH = 0;
        let buff = 0;
        let length = 0;

        // Records data start time
        let SonicTime = input.runningTime();
        // Keeps communication open while data is received or until 50 milliseconds have passed.
        while (DataH == 0 && DataL == 0 && input.runningTime() - SonicTime < 50) {
            // Sends start command to Ultrasonic Sensor
            pins.i2cWriteNumber(
                address,
                51,
                NumberFormat.UInt8BE,
                false
            );
            // Receives data response
            buff = pins.i2cReadNumber(address, NumberFormat.UInt8BE, false);
            // If data response is 1...
            if (buff == 1) {
                basic.pause(6);
                // Requests confirmation data
                pins.i2cWriteNumber(
                    address,
                    16,
                    NumberFormat.UInt8BE,
                    false
                );
                // Receives confirmation data
                buff = pins.i2cReadNumber(address, NumberFormat.UInt8BE, false);
                basic.pause(1);
                // Requests time taken (top section of the value) for signal to reflect
                pins.i2cWriteNumber(
                    address,
                    15,
                    NumberFormat.UInt8BE,
                    false
                );
                // Receives data on time taken for signal to reflect
                DataH = pins.i2cReadNumber(address, NumberFormat.UInt8BE, false);
                basic.pause(1);
                // Requests time taken (bottom section of the value) for signal to reflect
                pins.i2cWriteNumber(
                    address,
                    14,
                    NumberFormat.UInt8BE,
                    false
                );
                // Receives data on time taken for signal to reflect
                DataL = pins.i2cReadNumber(address, NumberFormat.UInt8BE, false);

                // If received data is false...
                if (buff != Math.constrain(DataH + DataL, 0, 255)) {
                    // Resets data
                    DataH = 0;
                    DataL = 0;
                }
            }
        }

        // Calculates distance to obstacle from time taken for signal to reflect
        length = (DataH * 256 + DataL - 160) / 2 * 0.315;
        // If Ultrasonic Sensor data is between 0 and 1,000mm
        if (0 <= length && length <= 1000) {
            // Rounds up/down Ultrasonic Sensor data
            length = Math.round(length);
        } else {
            // Resets Ultrasonic Sensor data to 0
            length = 0;
        }
        return (length);
    }


    //% blockId=COLOR block="COLOR %v"
    export function COLOR() {
        for (let index = 0; index <= 1; index++) {
            pins.i2cWriteNumber(64, 8 + index * 3, NumberFormat.UInt8BE, false)
            Hue[2] = pins.i2cReadNumber(64, NumberFormat.UInt8BE, false)
            pins.i2cWriteNumber(64, 9 + index * 3, NumberFormat.UInt8BE, false)
            Saturation[2] = pins.i2cReadNumber(64, NumberFormat.UInt8BE, false)
            pins.i2cWriteNumber(64, 10 + index * 3, NumberFormat.UInt8BE, false)
            Value[2] = pins.i2cReadNumber(64, NumberFormat.UInt8BE, false)

            if (Hue[2] != 255 && Saturation[2] != 255 && Value[2] != 255) {
                Hue[index] = Hue[2] * 2
                Saturation[index] = Saturation[2]
                Value[index] = Value[2]
            }

            if (Value[index] < 32) {
                Color = "Black"
            } else if (Saturation[index] < 48) {
                if (Value[index] < border) {
                    Color = "Black"
                } else {
                    Color = "White"
                }
            } else {
                if (0 <= Hue[index] && Hue[index] < 30) {
                    Color = "Red"
                } else if (30 <= Hue[index] && Hue[index] < 90) {
                    Color = "Yellow"
                } else if (90 <= Hue[index] && Hue[index] < 165) {
                    Color = "Green"
                } else if (165 <= Hue[index] && Hue[index] < 247.5) {
                    Color = "Blue"
                } else if (247.5 <= Hue[index] && Hue[index] < 322.5) {
                    Color = "Purple"
                } else if (322.5 <= Hue[index] && Hue[index] < 360) {
                    Color = "Red"
                } else {
                    Color = "ERROR"
                }
            }
            if (index == 0) {
                Color_L = Color
            } else {
                Color_R = Color
            }
        }
    }
}