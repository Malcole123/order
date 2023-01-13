<template>
    <div class="app-navbar app-container-fluid">
        <div class="app-navbar-inner">
            <span>
                <span class="navbar-menu-icon" @click="openMenu">
                    <svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" height="30" width="30" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m13 16.745c0-.414-.336-.75-.75-.75h-9.5c-.414 0-.75.336-.75.75s.336.75.75.75h9.5c.414 0 .75-.336.75-.75zm9-5c0-.414-.336-.75-.75-.75h-18.5c-.414 0-.75.336-.75.75s.336.75.75.75h18.5c.414 0 .75-.336.75-.75zm-4-5c0-.414-.336-.75-.75-.75h-14.5c-.414 0-.75.336-.75.75s.336.75.75.75h14.5c.414 0 .75-.336.75-.75z" fill-rule="nonzero"/></svg>
                </span>
            </span>
            <AppLogo @click="$router.push('/')"/>
            <div class="app-search-wrapper">
                <div class="app-search-input-wrapper">
                    <span class="search-input-icon">
                        <svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m15.97 17.031c-1.479 1.238-3.384 1.985-5.461 1.985-4.697 0-8.509-3.812-8.509-8.508s3.812-8.508 8.509-8.508c4.695 0 8.508 3.812 8.508 8.508 0 2.078-.747 3.984-1.985 5.461l4.749 4.75c.146.146.219.338.219.531 0 .587-.537.75-.75.75-.192 0-.384-.073-.531-.22zm-5.461-13.53c-3.868 0-7.007 3.14-7.007 7.007s3.139 7.007 7.007 7.007c3.866 0 7.007-3.14 7.007-7.007s-3.141-7.007-7.007-7.007z" fill-rule="nonzero"/></svg>
                    </span>
                    <input type="text" class="app-search-input" placeholder="Search for meals near you..." v-model.trim="search.input">
                    <span class="search-clear-icon" v-if="search.input.length > 0" @click="resetSearch">
                        Clear
                    </span>
                </div>
            </div>
            <div class="app-navlinks" v-if="$auth.loggedIn === false">
                <MazBtn color="black" size="mini" @click="$router.push('/auth/login/buyer')">Log In</MazBtn>
                <MazBtn color="primary" size="mini"  @click="$router.push('/auth/register/buyer')">Sign Up</MazBtn>
            </div>
            <div class="app-navlinks" v-else>
                <MazBtn color="black" size="mini" @click="openCart">Cart - 
                    {{ userCart.cart_items.length }}
                </MazBtn>
            </div>
        </div>
        <SlideDrawerVue
        @hideModal="closeCart" 
        :showModal="state.cartOpen"
        :showCloseLoading="state.cartLoading"
        :modalTitle="'Cart'"
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
        'pageLoading'
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
                menuOpen:false
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
                        link:"/favourites",
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
        let res = await this.fetchUserCart();
    },
    watch:{
        pageLoading(newVal,oldVal){
            if(newVal === false){
                this.userDelayAction(async ()=>{
                    //await this.fetchUserCart()
                }, 400)
            }
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

    .app-search-wrapper{
        position:relative;
    }

    .app-search-input-wrapper{
        position:relative;
        height:fit-content;
        width:fit-content;
    }

    .app-search-input{
        width:22em;
        height:40px;
        background:var( --app-platinum);
        padding-left:10%;
        padding-right:15%;
        border:none;
        position:relative;
    }

    .app-search-input:focus{
        outline:none;
    }

    .search-input-icon, .search-clear-icon{
        position:absolute;
        top:50%;
        left:1%;
        transform:translateY(-50%);
        z-index:2;
    }

    .search-input-icon svg{
        width:22px;
        height:22px;
    }

    .search-clear-icon{
        font-size:14px;
        font-weight:600;
        color:var(--app-prim-black);
        left:auto;
        right:0%;
        height:100%;
        width:fit-content;
        display:flex;
        align-items:center;
        cursor:pointer;
        padding-right:10px;
        background:var( --app-platinum);
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
        .app-search-wrapper{
            position:fixed;
            top:-100%;
            left:0%;
        }
    }
</style>