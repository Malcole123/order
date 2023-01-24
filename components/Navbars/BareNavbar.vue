<template>
    <div class="app-navbar app-container-fluid">
        <div class="app-navbar-inner">
            <span>
                <span class="navbar-menu-icon" @click="goBack" v-if="state.showBack === true">
                    <svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" height="30" width="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m22 6c0-.552-.448-1-1-1h-12.628c-.437 0-.853.191-1.138.523-1.078 1.256-3.811 4.439-4.993 5.815-.16.187-.241.419-.241.651 0 .231.08.463.24.651 1.181 1.38 3.915 4.575 4.994 5.835.285.333.701.525 1.14.525h12.626c.552 0 1-.448 1-1 0-2.577 0-9.423 0-12zm-13.628.5h12.128v11h-12.126l-4.715-5.51zm5.637 4.427 1.71-1.71c.146-.146.339-.219.531-.219.404 0 .75.324.75.749 0 .193-.073.384-.219.531l-1.711 1.711 1.728 1.728c.147.147.22.339.22.53 0 .427-.349.751-.75.751-.192 0-.384-.073-.531-.219l-1.728-1.729-1.728 1.729c-.146.146-.339.219-.531.219-.401 0-.75-.324-.75-.751 0-.191.073-.383.22-.53l1.728-1.728-1.788-1.787c-.146-.148-.219-.339-.219-.532 0-.425.346-.749.751-.749.192 0 .384.073.53.219z" fill-rule="nonzero"/></svg>                
                </span>
                <span class="navbar-menu-icon" @click="openMenu" v-else>
                    <svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" height="30" width="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m13 16.745c0-.414-.336-.75-.75-.75h-9.5c-.414 0-.75.336-.75.75s.336.75.75.75h9.5c.414 0 .75-.336.75-.75zm9-5c0-.414-.336-.75-.75-.75h-18.5c-.414 0-.75.336-.75.75s.336.75.75.75h18.5c.414 0 .75-.336.75-.75zm-4-5c0-.414-.336-.75-.75-.75h-14.5c-.414 0-.75.336-.75.75s.336.75.75.75h14.5c.414 0 .75-.336.75-.75z" fill-rule="nonzero"/></svg>
                </span>
            </span>
            <AppLogo @click="$router.push('/')"/>
        
            <div class="app-navlinks" v-if="$auth.loggedIn === false">
                <MazBtn color="black" size="mini" @click="$router.push('/auth/login/buyer')">Log In</MazBtn>
                <MazBtn color="primary" size="mini"  @click="$router.push('/auth/register/buyer')">Sign Up</MazBtn>
            </div>
            <div class="app-navlinks" v-else>
                <MazBtn color="black" size="mini" @click="openCart" v-if="hideCart !== true">Cart - 
                    {{ userCart.cart_items.length }}
                </MazBtn>
            </div>
        </div>
        <SlideDrawerVue
        @hideModal="closeCart" 
        :showModal="state.cartOpen"
        :showCloseLoading="state.cartLoading"
        :modalTitle="'Cart'"
        v-if="hideCart !== true"
        >
            <template v-slot:modal_body>
                <div class="full-width">
                    <MazList
                    :noShadow="true"
                    :noScroll="true"
                    >
                        <MazListItem v-for="(cItem,index) in userCart.cart_items" :key="'cart-item-'+ index">
                            <CartCheckoutCardVue
                                :data_id="cItem.id" 
                                :index="index"
                                :title="cItem.item.product_details.name.short"
                                :quantity="cItem.item.quantity"
                                :desc="cItem.item.special_instruction"
                                :price="cItem.item.price"
                                @valueChanged="updateUserQuantity"
                                :addons="cItem.item.addons"
                            />
                        </MazListItem>
                    </MazList>
                </div>
            </template>
            <template v-slot:footer_btn>
                <MazBtn color="black"
                :loading="state.cartLoading"
                @click="checkoutUserCart"
                >Checkout - {{ userCart.cart_total }}</MazBtn>
            </template>
        </SlideDrawerVue>
        <SlideDrawerVue
        @hideModal="closeMenu" 
        :showModal="state.menuOpen"
        :showCloseLoading="false"
        :modalTitle="''"
        :slidePos="'left'"
        :modalSize="'sml'"
        >
            <template v-slot:slide_draw_body_full>
                <div class="navbar-menu-wrapper app-container-fluid">
                    <div class="navbar-menu-links">
                        <div class="full-width app-flex app-flex-between-row">
                            <span>
                                <span>

                                </span>
                            </span>
                            <MazBtn size="mini" @click="closeMenu" color="black">Close</MazBtn>
                        </div>
                        <div class="full-width" v-for="(navLink,index) in userNavLinks" :key="'user-navlink-'+ index">
                            <NuxtLink :to="navLink.link" class="navbar-menu-link">{{ navLink.name }}</NuxtLink>
                        </div>
                    </div>
                </div>
            </template>
           
        </SlideDrawerVue>
    </div>
</template>

<script>
import AppLogo from '~/components/Branding/AppLogo.vue';
import SlideDrawerVue from '../Modals/SlideDrawer.vue';
import CartCheckoutCardVue from '../Cart/CartCheckoutCard.vue';

export default {
    components:{
        AppLogo,
        SlideDrawerVue,
        CartCheckoutCardVue,
    },
    props:[
        'pageLoading',
        'hideCart',
        'showBack'
    ],
    data(){
        return {
            search:{
                input:"",
                state:{

                }
            },
            state:{
                cartOpen:false,
                cartLoading:false,
                menuOpen:false,
                showBack:false,
            },
            component_data:{
                cart:{
                    cart_items:[],
                    changed:false,
                }
            },
            cartRefreshKey:"1212",
            navLinks:{
                loggedIn:[
                    {
                        name:"Your Orders",
                        link:"/orders",
                        icon:"bookmark",
                    },
                    {
                        name:"Your Favourites",
                        link:"/me/favourites",
                        icon:"bookmark",
                    },
                ],
                loggedOut:[
                {
                        name:"Log In",
                        link:"/auth/login",
                        icon:"bookmark",
                    },
                    {
                        name:"Sign Up",
                        link:"/auth/register",
                        icon:"bookmark",
                    }
                ]
            }
            
        }
    },
    async mounted(){
        this.state.showBack = this.showBack;
        if(this.hideCart !== true){
            let res = await this.fetchUserCart();
        }
    },
    watch:{
        pageLoading(newVal,oldVal){
            if(newVal === false){
                this.userDelayAction(async ()=>{
                    //await this.fetchUserCart()
                }, 400)
            }
        },
        showBack(newVal,oldVal){
            this.state.showBack = newVal;
        }
    },
    methods:{
        resetSearch(){
            this.search.input = ""
        },
         openCart(){
            this.state.cartOpen = true;
        },
        closeCart(){
            if(this.component_data.cart.changed === false || this.state.cartLoading === true){
                this.state.cartOpen = false;
                return 
            }
            this.state.cartLoading = true;
            this.userDelayAction(async ()=>{
                let response_ = await this.syncUserCart();
                this.component_data.cart.changed = false;
                this.userDelayAction(()=>{
                    this.state.cartLoading = false;
                    this.userDelayAction(()=>{
                        this.state.cartOpen = false;
                    },300)
                }, 600)
            }, 200)
        },
        openMenu(){
            this.state.menuOpen = true;
        },  
        closeMenu(){
            this.state.menuOpen = false;
        },
        async syncUserCart(){
            await this.$store.dispatch('user/syncUserCartToDB');
        },
        async updateUserQuantity(val){
            let res_ = await this.$store.commit('user/updateSingleCartItem', {
                id:val.id,
                quantity:val.value,
                remove:val.quantity === 0 ? true : false,
                index:val.index,
            });
            this.component_data.cart.changed = true;
        },
        async fetchUserCart(){
            let dt = await this.$store.dispatch('user/getUserCart');
            return dt
        },
        async checkoutUserCart(){
            this.state.cartLoading = true;
            if(this.component_data.cart.changed){
                await this.syncUserCart();
            }
            this.userDelayAction(()=>{
                this.$router.push('/cart/checkout')
            },700)
        },
        userDelayAction(callbck, time){
            setTimeout(async ()=>{
                await callbck()
            }, time)
        },
        priceFormatter(currency,amount){
            let form = new Intl.NumberFormat('en-US', {style:'currency',currency:currency});
            return form.format(amount)
        },
        goBack(){
            this.$router.go(-1);
        }

    },
    computed:{
        userCart(){
            let cart = this.$store.getters['user/userCartItems'];
            let cart_items = [...cart.cart_items].filter((item,index)=>{
                if(item.item.quantity > 0){
                    return item;
                }
            })
            let cart_total = this.priceFormatter('JMD', cart.cart_total);
            return {
                cart_items,
                cart_total,
            }
        },
        userNavLinks(){
            let navLink = this.$auth.loggedIn === true ? this.navLinks.loggedIn : this.navLinks.loggedOut;
            return navLink
        }
    }
}
</script>

<style scoped>
    .app-navbar{
        position:fixed;
        top:0;
        left:0;
        right:0;
        height:70px;
        background:var(--app-prim-light);
        display:flex;
        align-items:center;
        border-bottom:0.5px solid  var(--app-platinum);
        z-index:99;
    }

    .app-navbar-inner{
        width:100%;
        height:100%;
        display:flex;
        gap:1.5em;
        align-items:center;
    }

    .app-navlinks{
        margin-left:auto;
        display:flex;
        align-items:center;
        height:100%;
        gap:.5em;
    }

    .navbar-menu-icon{
        cursor:pointer;
    }
    
    .navbar-menu-wrapper{
        width:100%;
        height:100%;
        position:relative;
        overflow-y:scroll;
    }

    .navbar-menu-links{
        width:100%;
        height:fit-content;
        display:flex;
        flex-direction:column;
        gap:1em;
    }



    .navbar-menu-link{
        font-size:var(--app-text-base);
        font-weight:600;
        text-decoration:none;
        color:var(--app-prim-black)
    }

    @media (max-width:992px) {
   
    }
</style>