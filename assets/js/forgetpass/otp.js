console.log("hi")
let otpnum = document.getElementById('otpnum').value;
if(otpnum.length <= 1){
    document.getElementById('otpnum').innerHTML = otpnum;
}
else{
    console.log("fill this otp");
}