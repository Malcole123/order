<template>
    <div class="app-auth-wrapper full-width app-grid app-grid-duo">
        <div class="full-width app-auth-illustration-wrapper app-auth-parent-wrapper">
            <MazBtn color="black" @click="$router.push('/')">Go Home</MazBtn>
        </div>
        <div class="full-width app-auth-action-wrapper app-auth-parent-wrapper app-flex app-center-flex">
                <div class="app-auth-action-container">
                    <div class="full-width app-flex app-flex-between-row app-auth-header">
                        <span class="app-loader app-loader-text-lg app-w-50" v-if="loading">
                            </span>
                        <h2 class="app-auth-heading" v-else>                     
                           <span v-if="auth_type ==='login'">Welcome Back ,</span>
                           <span v-if="auth_type ==='register'">Sign Up</span>

                        </h2>
                        <NuxtLink :to="authRedirect.link" class="app-auth-heading-redirect" v-if="loading === false">{{ authRedirect.label }}</NuxtLink>
                    </div>
                    <form class="app-auth-body" v-if="loading === false" @submit.prevent="formSubmitHandle">
                        <div class="full-width app-grid app-grid-duo-strict app-md-spacing" v-if="auth_type === 'register'">
                            <div class="full-width">
                                <MazInput
                                v-model="form.name.first"
                                placeholder="First Name"
                                color="light"
                                class="maz-mb-3"
                                clearable
                                :dark="true"
                                :required="true"
                                >
                                <i
                                    slot="icon-right"
                                    class="material-icons"
                                >
                                    info
                                </i>
                                </MazInput>
                            </div>
                            <div class="full-width">
                                <MazInput
                                v-model="form.name.last"
                                placeholder="Last Name"
                                color="light"
                                class="maz-mb-3"
                                :required="true"
                                :dark="true"
                                clearable
                                >
                                <i
                                    slot="icon-right"
                                    class="material-icons"
                                >
                                    info
                                </i>
                                </MazInput>
                            </div>
                        </div>
                        <div class="full-width">
                            <MazInput
                                v-model="form.email"
                                placeholder="E-mail"
                                type="email"
                                autocomplete="new-email"
                                color="light"
                                class="maz-mb-3"
                                :dark="true"
                                :required="true"
                                clearable
                                >
                                <i
                                    slot="icon-left"
                                    class="material-icons"
                                >
                                    email
                                </i>
                                <i
                                    slot="icon-right"
                                    class="material-icons"
                                >
                                    info
                                </i>
                                </MazInput>
                        </div>
                        <div class="full-width">
                            <MazInput
                                v-model="form.password"
                                placeholder="Password"
                                color="light"
                                class="maz-mb-3"
                                clearable
                                type="password"
                                :success="state.error.password.success"
                                :error="state.error.password.erro"
                                :warning="state.error.password.warning"
                                :dark="true"
                                :required="true"
                                >
                                <i
                                    slot="icon-left"
                                    class="material-icons"
                                >
                                    lock
                                </i>
                                <i
                                    slot="icon-right"
                                    class="material-icons"
                                >
                                    info
                                </i>
                            </MazInput>
                        </div>
                        <div class="full-width">
                            <MazBtn color="third" 
                            :type="state.processing === false ? 'submit' : 'button'"
                            size="lg" style="width:100%;font-weight:600"
                                :loading="state.processing"
                            >
                                <span v-if="auth_type ==='login'">Log In</span>
                                <span v-if="auth_type ==='register'">Sign Up</span>
                           
                            </MazBtn>
                        </div>
                    </form>
                </div>
        </div>

    </div>

</template>

<script>
export default {
    head(){
        let path = this.$router.history.current.fullPath;
        let res = this.pathDetermine(path)
        return {
            title:this.auth_type,
        }
    },
    data(){
        return {
            auth_type:"",
            loading:true,
            form:{
                email:"",
                password:"",
                name:{
                    first:"",
                    last:"",
                },
                phone_number:"",
            },
            state:{
                processing:false,
                error:{
                    email:{
                        success:false,
                        error:false,
                        warning:false,
                    },
                    password:{
                        success:false,
                        error:false,
                        warning:false,
                    },
                },
            }
        }
    },
    mounted(){
        setTimeout(()=>{
            this.loading = false;
        },900)
    },
    methods:{
        pathDetermine(path){
            //Returns set keys based on path; log_in , reset_password , sign_up
            let path_arr = path.split('/');    
            let title = path_arr[path_arr.length-1];
            this.auth_type = title;
            return {
                title,
            }

        },
        async formSubmitHandle(){
            this.state.processing = true;
            let type_ = this.auth_type;
            let response_ = {
                ok:false,
            };
            try{
                switch(type_){
                    case "login":
                            response_ = await this.loginAction()
                            break
                    case "register":
                            response_ = await this.registerAction();
                            break
                    
                }

                if(response_.ok){
                    this.$router.push('/');
                }else{
                    this.errorHandle();
                }
            }catch(err){
                //Show Event Handle Area 
                this.errorHandle();
                return 
            }
        },
        async loginAction(){
            let data = await this.$store.dispatch('user/userLogin', {
                email:this.form.email,
                password:this.form.password,
            });
            return data;
        },
        async registerAction(){
            let data = await this.$store.dispatch('user/userRegister', {
                email:this.form.email,
                password:this.form.password,
                name:{
                    first:this.form.name.first,
                    last:this.form.name.last,
                    alias:"",
                }
            });
            return data;
        },
        errorHandle(){
            this.state.error.email.error = true;
                this.state.error.password.error = true;
                this.state.processing = false;
        },
        
    },
    watch:{
        $route(newVal,prevVal){
            this.pathDetermine(newVal.fullPath)
        },
    },
    computed:{
        authRedirect(){
            let type_ = this.auth_type;
            let ret_ = {
                label:"",
                link:"",
            }
            switch(type_){
                case "register":
                        ret_.label = "Already have an account ? Log In";
                        ret_.link = "/auth/login"
                    break
                case "login":
                        ret_.label = "Don't have an account ? Sign In";
                        ret_.link = "/auth/register"
                    break
            }
            return ret_
        }
    }
}
</script>

<style>
    .app-auth-wrapper{
        width:100%;
        height:100vh;
        background:var(--app-prim-black);

    }

    .app-auth-parent-wrapper{
        padding:1em 2em;
    }

    .app-auth-illustration-wrapper, .app-auth-action-wrapper{
        width:100%;
        height:100%;
    }

    .app-auth-illustration-wrapper{
        background:var(--app-prim-accent);
    }

    .app-auth-action-container{
        width:70%;
        height:100%;
    }

    .app-auth-header{
        padding:1em 0em;
        margin-bottom:2em;
    }

    .app-auth-action-component{
        padding:2em 0em;
    }

    .app-auth-heading{
        color:var(--app-prim-light);
        font-size:var(--app-text-xl);
        margin:0px;
        text-transform:capitalize;
    }

    .app-auth-heading-redirect{
        text-decoration:none;
        color:var(--app-prim-light);
        font-size:var(--app-text-base);
        margin:0px;
        font-weight:700;
        word-spacing:0.1em;
        text-decoration:underline;
    }

    .app-auth-body{
        display:flex;
        flex-direction:column;
        gap:1em;
        padding-top:1em;
        padding-bottom:1em;
    }

    @media (max-width:992px) {
        .app-auth-illustration-wrapper{
           position:fixed;
           bottom:0%;
           left:0%;
           z-index:1;
           height:10%;
        }
        .app-auth-parent-wrapper{
            padding:1em 0.8em;
        }
        .app-auth-action-container{
            width:100%;
            height:100%;
        }

        .app-auth-heading{
            color:var(--app-prim-light);
            font-size:var(--app-text-xl);
            margin:0px;
            text-transform:capitalize;
        }

        
    }
 
</style>