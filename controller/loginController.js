import axios from 'axios';
export class Login{
    static loginPage(req,res){
        res.render("login",{error:"",layout:"./layout/loginLayout.ejs"})
        }
    static async getUser(req,res){
        const {login,password} = req.body;
        if(login=="" || password==""){
            return res.render("login",{error:"نام کاربری و رمز عبور الزامی می باشد",layout:"./layout/loginLayout.ejs"})
        }
        try {
            const {data} = await axios.post("http://192.168.10.20/api/login",{login,password});
        if(!data.message){
        process.env.token = data.user.token;
        process.env.full_name = data.user.full_name;        
         res.render("home",{error:""})
        }else{
            res.render("login",{error:"کاربری با این مشخصات وجود ندارد",layout:"./layout/loginLayout.ejs"})
        }
        } catch (err) {
            res.render("login",{error:"کاربری با این مشخصات وجود ندارد",layout:"./layout/loginLayout.ejs"})
        }
    }
}