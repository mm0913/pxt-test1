//% weight=10 icon="\uf085" color=#FFA400 block="m-robo"
namespace robo_test {
    let a;

    //% blockId=plus block="plus %v"
    export function plus(){
        a = 1+1;
    }
    
    //% blockId=answer block="answer %v"
    export function answer(){
        return(123);
    }
}