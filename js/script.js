// ============================================
// EDU RURAL CENTRAL - MAIN JAVASCRIPT
// ============================================

document.addEventListener("DOMContentLoaded", () => {

    // LOGIN PAGE
    const loginForm = document.querySelector("form");

    if (document.title.includes("Login")) {

        loginForm.addEventListener("submit", function(e){

            e.preventDefault();

            let username = document.querySelector('input[type="text"]').value.trim();
            let password = document.querySelector('input[type="password"]').value.trim();

            if(username==="" || password===""){
                alert("❌ Please enter Username and Password.");
                return;
            }

            alert("✅ Login Successful!\nWelcome to EduRural Central.");

            setTimeout(()=>{
                window.location.href="dashboard.html";
            },1000);

        });

    }


    // REGISTER PAGE
    if(document.title.includes("Register")){

        loginForm.addEventListener("submit",function(e){

            e.preventDefault();

            let inputs=document.querySelectorAll("input");

            for(let input of inputs){

                if(input.value.trim()==""){

                    alert("❌ Please complete all fields.");

                    return;
                }

            }

            alert("🎉 Registration Successful!\nYour account has been created.");

            setTimeout(()=>{
                window.location.href="dashboard.html";
            },1000);

        });

    }



    // RESET PASSWORD
    if(document.title.includes("Reset")){

        loginForm.addEventListener("submit",function(e){

            e.preventDefault();

            let username=document.querySelector('input[type="text"]').value.trim();

            if(username==""){

                alert("❌ Please enter your username.");

                return;
            }

            alert("📧 Password Reset Link Sent Successfully!");

            setTimeout(()=>{
                window.location.href="login.html";
            },1000);

        });

    }



    // LOGOUT
    const logout=document.querySelector(".btn-logout");

    if(logout){

        logout.addEventListener("click",function(e){

            let answer=confirm("Are you sure you want to logout?");

            if(!answer){

                e.preventDefault();

            }else{

                alert("👋 Logout Successful.");

            }

        });

    }

});