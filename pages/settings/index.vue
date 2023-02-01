<template>
    <MainWrapper>
      <template v-slot:navbar>
          <ApplicationNavbarVue
          :pageLoading="state.pageLoading"
          />
      </template>
      <template v-slot:body>
            <div class="settings-page-body">
              <div class="settings-page-links-wrapper">
                      <div class="settings-page-link"
                      v-for="(setting_link, index) in settings_links"
                      :key="'setting-link-'+ index"
                      @click="$router.push(setting_link.link)"
                      >
                          <span>
                              <span>
                                {{ setting_link.name }}
                              </span>
                          </span>
                
                          <span style="margin-left:auto">
                            <span class="material-icons" v-html="setting_link.icon">
                              
                            </span>
                          </span>
                          <div class="settings-page-link-indicator" v-if="setting_link.current"></div>
                        </div>
                        <div class="settings-page-link" style="background:#fff">
                          <MazBtn color="black" size="sm" style="width:100%"
                          @click="logoutUser"
                          >Log Out</MazBtn>
                        </div>
                </div>
              <div :class="settingActionClass">
                <div class="settings-page-action-container" v-if="setting_path === 'profile_details'">
                  <div class="full-width">
                    <h1>
                      <span class="settings-application-cntrl">
                        <span class="material-icons" @click="disableActionArea">
                              backspace
                        </span>
                      </span>
                      <span>
                
                      </span>
                      </h1>
                  </div>
                  <div class="full-width">
                      <form
                      @submit.prevent="syncUserProfileDetails"
                      class="settings-page-form"
                      >
                        <div class="full-width">
                            <p class="setting-form-label">First Name</p>
                            <MazInput
                              label="First Name"
                              color="black"
                              placeholder="First Name"
                              v-model="profile_details_form.name.first"
                            />
                        </div>
                        <div class="full-width">
                          <p class="setting-form-label">Last Name</p>
                            <MazInput
                              label="Last Name"
                              color="black"
                              placeholder="Last Name"
                              v-model="profile_details_form.name.last"
                            />
                        </div>
                        <div class="full-width">
                          <p class="setting-form-label">Email</p>
                            <MazInput
                            label="Email"
                              color="black"
                              placeholder="Email"
                              v-model="profile_details_form.email"
                            />
                        </div>
                        <div class="full-width">
                          <p class="setting-form-label">Phone number</p>
                          <MazPhoneNumberInput
                            v-if="state.edit.phone_number"
                            label="Phone number"
                            color="black"
                            placeholder="Your phone number"
                            v-model="profile_details_form.phoneModel"
                            @update="setPhoneNumber"
                          />
                          <MazInput
                            v-else
                            color="black"
                            label="Phone Number"
                            placeholder="Phone Number"
                            v-model="profile_details_form.phone_number"
                            readonly
                            @click="editPhoneNumber"
                          />
                        </div>
                        <div class="full-width">
                          <p class="setting-form-label">Country</p>
                          <MazSelect
                            label="Country"
                            color="black"
                            placeholder="Select"
                            :options="countried_options"
                            :listWidth="'100%'"
                            :search="true"
                            v-model="profile_details_form.country"
                          />
                        </div>
                        <div class="full-width">
                          <MazBtn color="black" 
                          style="width:100%;" 
                          :loading="state.form_proccessing"
                          type="submit">Save Changes</MazBtn>
                        </div>
                      </form>
                  </div>              
                </div>
                <div class="settings-page-action-container" v-if="setting_path === 'account_security'">
                  <div class="full-width">
                    <h1>
                      <span class="settings-application-cntrl">
                        <span class="material-icons" @click="disableActionArea">
                              backspace
                        </span>
                      </span>
                      <span>
                
                      </span>
                      </h1>
                  </div>
                  <div class="full-width">
                      <form
                      @submit.prevent="syncUserProfileDetails"
                      class="settings-page-form"
                      >
                        <div class="full-width">
                            <p class="setting-form-label">First Name</p>
                            <MazInput
                              label="First Name"
                              color="black"
                              placeholder="First Name"
                              v-model="profile_details_form.name.first"
                            />
                        </div>
                     
                        <div class="full-width">
                          <MazBtn color="black" 
                          style="width:100%;" 
                          :loading="state.form_proccessing"
                          type="submit">Save Changes</MazBtn>
                        </div>
                      </form>
                  </div>              
                </div>
              </div>
            </div>
      </template>
    </MainWrapper>
 
</template>

<script>
import ApplicationNavbarVue from '~/components/Navbars/ApplicationNavbar.vue';
import MainWrapper from '~/components/Wrapper/MainWrapper.vue';
import SquareDisplayCard from '~/components/Cards/DisplayCards/SquareDisplayCard.vue';
import RestaurantDisplayCard from '~/components/Cards/DisplayCards/RestaurantDisplayCard.vue';
import OrderResultDisplayCard from '~/components/Cards/DisplayCards/OrderResultDisplayCard.vue'
import RedeemOrderItemDisplayCard from '~/components/Cards/DisplayCards/RedeemOrderItemDisplayCard.vue';

export default {
  name: 'settings_landing_page',
  head(){
    return {
      title:"Settings",
    }
  },
  async asyncData({$axios, route, store, env, params, query, req, res, redirect, error}) {    
    let path_ = params.setting_type;
    return{
        successLoad:true,
        setting_path:path_,
    }
  },
  data(){
    return {
      state:{
        pageLoading:true,
        actionAreaActive:false,
        form_proccessing:false,
        edit:{
          name:false,
          phone_number:false,
        }
      },
      settings_links:[
        {
          name:"Profile Settings",
          link:"/settings/profile_details",
          icon:"person_outline",
          filter_key:"profile_details",
          current:false,
        },
        {
          name:"Account Security",
          link:"/settings/account_security",
          icon:"admin_panel_settings",
          filter_key:"account_security",
          current:false,
        },
        {
          name:"Payment Methods",
          link:"/settings/payment_methods",
          icon:"credit_card",
          filter_key:"payment_methods",
          current:false,
        },
      ],
      countried_options:[
        {
          label:"Jamaica",
          value:"jamaica"
        },
      ],
      pageData:{
        title:"",
      },
      profile_details_form:{
        name:{
          first:"",
          last:"",
          alias:"",
        },
        email:"",
        username:"",
        country:"",
        phone_number:"",
        phoneModel:null,
      }
    }
  },
  fetchOnServer:false,
  fetch(){
    this.setProfileDetails();
    this.initiateSettings();
    this.userDelayAction(()=>{
      this.state.pageLoading = false;
    }, 600)
  },
  components:{
    MainWrapper,
    ApplicationNavbarVue,
    SquareDisplayCard,
    RestaurantDisplayCard,
    OrderResultDisplayCard,
    RedeemOrderItemDisplayCard,
  },
  methods:{
    userDelayAction(callback, time){
      setTimeout(()=>{
          callback()
      }, time)
    },
    setFilterVal(val){
        this.filter = val;
    },
    initiateSettings(){
      let path = this.$route.params.setting_type;
      this.settings_links = [...this.settings_links].map((item,index)=>{
        if(item.filter_key === path){
          this.pageData.title = item.name;
          item.current = true;
          return item 
        }else{
          item.current = false;
        }
        return item 
      });
      this.state.actionAreaActive = true;
    },
    disableActionArea(){
      this.state.actionAreaActive = false;
    },
    setPhoneNumber(data){
      const { isValid , e164 } = data;
      if(isValid === false){ return }
      this.profile_details_form.phone_number = e164;
    },
    setProfileDetails(){
      const { name , email, phone_number , country} = this.$auth.user;
      this.profile_details_form.name = name;
      this.profile_details_form.email = email;
      this.profile_details_form.phone_number = phone_number;
      this.profile_details_form.country = country;
    },
    async syncUserProfileDetails(){
      this.state.form_proccessing = true;
      const { name , email , country, phone_number } = this.profile_details_form;
      let dt = await this.$store.dispatch('user/updateUserDetails', {
          name,
          email,
          country,
          phone_number
      })
      if(dt.ok){
        this.$toast.open({
          message:"Your profile has been updated successfully.",
          type:"success",
        });
        this.state.form_proccessing = false;
        this.userDelayAction(()=>{
          window.location.href = window.location.href;
        }, 3000);
      }else{
        this.state.form_proccessing = false;
        this.$toast.open({
          message:"Something went wrong. Please try again later.",
          type:"error",
        });
      }
    },
    editPhoneNumber(){
      this.state.edit.phone_number = true;
    },
    logoutUser(){
      this.$auth.logout();
      this.$router.push("/")
    }    
  },
  computed:{
    settingActionClass(){
      let base_class = "settings-page-action-wrapper full-width";
      let action_class = "settings-page-active-wrapper";
      let use_class = this.state.actionAreaActive === true ? base_class + " " + action_class : base_class;
      return use_class;
    }
  },
  watch:{
    $route(newVal,oldVal){
      console.log('changed')
    }
  }
}
</script>

<style>
  .settings-page-body{
    width:100%;
    display:grid;
    grid-template-columns:1fr 4fr;
    gap:0px;
    height:88vh;
  }

  .settings-page-links-wrapper{
    width:100%;
    display:flex;
    flex-direction:column;
    background:var(--app-prim-light)
  }

  .settings-page-link{
    display:flex;
    align-items:center;
    gap:20px;
    padding:0.8em 0.5em;
    cursor:pointer;
    position:relative;
    text-decoration:none;
    color:var(--app-prim-black)
  }
  
  .settings-page-link-indicator{
    position:absolute;
    top:0;
    right:0;
    height:100%;
    width:4px;
    background:var(--app-prim-black)
  }

  .settings-page-links-wrapper > *:nth-child(even){
    border-top:0.1px solid var(--app-grey);
    border-bottom:0.1px solid var(--app-grey)
  }

  .settings-page-link:hover{
    background:#eeee;
  }

  .settings-page-action-wrapper{
    width:100%;
    height:100%;
    overflow-y:scroll;
  }

  .settings-page-action-container{
    width:50%;
    height:fit-content;
    display:flex;
    flex-direction:column;
    padding:4% 1%;
  }

  .settings-application-cntrl{
    display:none
  }

 .settings-page-form{
  display:flex;
  flex-direction:column;
  gap:20px;
 }

 .setting-form-label{
  font-size:var(--app-text-xs);
 }

  @media(max-width:992px){
    .settings-page-body{
      grid-template-columns:1fr;
    }

    .settings-page-links-wrapper{
      height:100%;
    }

    .settings-page-action-wrapper{
      position:fixed;
      right:-100%;
      top:0%;
      width:100%;
      height:100%;
      background:var(--app-prim-light);
      transition:0.3s ease-in-out;
    }

    .settings-page-active-wrapper{
      right:0%;
      z-index:999;
    }

    .settings-page-action-container{
      width:100%;
      padding:2% 1%;
    }

    .settings-application-cntrl{
        display:flex;
        gap:10px;
        align-items:center;
        cursor:pointer;
      }

      .settings-application-cntrl .material-icons{
        font-size:var(--app-text-lg)
      }
  }
  
</style>
