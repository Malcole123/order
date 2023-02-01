<template>
    <div class="app-navbar app-container-fluid">
        <div class="app-navbar-inner">
            <AppLogo @click="$router.push('/')"/>
            <div :class="searchComponentClass">
                <div class="app-search-wrapper-header">
                    <MazBtn color="black" outline size="mini" @click="closeSearch">Close</MazBtn>
                </div>
                <div class="app-search-input-wrapper">
                    <span class="search-input-icon">
                        <svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m15.97 17.031c-1.479 1.238-3.384 1.985-5.461 1.985-4.697 0-8.509-3.812-8.509-8.508s3.812-8.508 8.509-8.508c4.695 0 8.508 3.812 8.508 8.508 0 2.078-.747 3.984-1.985 5.461l4.749 4.75c.146.146.219.338.219.531 0 .587-.537.75-.75.75-.192 0-.384-.073-.531-.22zm-5.461-13.53c-3.868 0-7.007 3.14-7.007 7.007s3.139 7.007 7.007 7.007c3.866 0 7.007-3.14 7.007-7.007s-3.141-7.007-7.007-7.007z" fill-rule="nonzero"/></svg>
                    </span>
                    <input type="text" 
                    class="app-search-input" 
                    placeholder="Search for meals near you..."
                    @keyup="searchBarMonitor" 
                    v-model.trim="search.input">
                    <span class="search-clear-icon" v-if="search.input.length > 0" @click="resetSearch">
                        Clear
                    </span>
                </div>
                <div class="app-search-results-wrapper" v-if="state.autocompleteOpen">
                    <div class="app-search-results-container" v-if="autocompleteResults.products.length > 0 || autocompleteResults.store.length > 0">
                        <div class="app-search-autocomplete-wrapper" v-if="state.autocompleteSearching">
                            <div class="app-search-autocomplete "
                            v-for="n in 12"
                            :key="'item-n-'+ n"
                            >
                                <span>
                                    <span class="app-search-autocomp-icon">
                                       
                                    </span>
                                </span>
                                <span>
                                    <span class="app-autocomplete-result-text">
                                        <div class="autocomplete-result-placeholder" style="width:330px;height:26px;">
                                            <div class="app-skeleton"></div>
                                        </div>
                                        <div class="autocomplete-result-placeholder app-mt-1" style="width:220px;height:18px;">
                                            <div class="app-skeleton"></div>
                                        </div>
                                    </span>
                                </span>
                                <span style="margin-left:auto;">
                                    <span>
                                        <div class="autocomplete-result-placeholder" style="width:30px;height:26px;">
                                            <div class="app-skeleton"></div>
                                        </div>
                                    </span>
                                </span>
                            </div>
                        </div>
                        <div class="app-search-autocomplete-wrapper" v-else>
                            <div class="app-search-autocomplete "

                            v-for="(search,index) in autocompleteResults.store"
                            :key="`search-autcomplete-store-${index}`"
                            @click="$router.push(`/store/${search.store_reference}`)"
                            >
                                <span>
                                    <MazAvatar
                                        :src="search.promotional.image.storeLogo.url"
                                        size="64"
                                    />
                                </span>
                                <span>
                                    <span class="app-autocomplete-result-text">
                                        <div class="autocomplete-result-placeholder" style="width:100%;height:26px;">
                                          {{ search.name.long }}<span class="app-autocomplete-text-match"></span>
                                        </div>
                                        <div class="autocomplete-result-placeholder" style="width:220px">
                                            <small class="autocomplete-subtitle"> Store > {{ search.store_type }}</small>
                                        </div>
                                    </span>
                                </span>
                                <span style="margin-left:auto;">
                                    <span>
                                        <span class="material-icons">
                                        arrow_forward
                                        </span>
                                    </span>
                                </span>
                            </div>
                            <div class="app-search-autocomplete "
                            v-for="(search,index) in autocompleteResults.products"
                            :key="`search-autocomplete-products-${index}`"
                            @click="$router.push(`/store/${search.store.store_reference}/${search.product_uuid}`)"
                            >
                                <span>
                                    <span class="app-search-autocomp-icon">
                                        <span class="material-icons">
                                            search
                                        </span>
                                    </span>
                                </span>
                                <span>
                                    <span class="app-autocomplete-result-text">
                                        <div class="autocomplete-result-placeholder" style="width:100%;height:26px;">
                                          {{ search.name.short }}<span class="app-autocomplete-text-match"></span>
                                        </div>
                                    </span>
                                </span>
                                <span style="margin-left:auto;">
                                    <span>
                                        <span class="material-icons">
                                        arrow_forward
                                        </span>
                                    </span>
                                </span>
                            </div>
                        </div>
                    </div>
                    <div class="app-search-empty-results-wrapper" v-else>
                        <span>
                            <span>
                                <span class="material-icons">
                                search_off
                                </span>
                            </span>
                        </span>
                        <span class="app-search-result-prompt">No Results Found</span>
                    </div>
                </div>
            </div>
            <span style="margin-left:auto">
            <!--Placeholder to maintain spacing for component-->
            </span>
            <div class="app-navlinks" v-if="$auth.loggedIn === false">
                <div class="app-conversion-banner">
                    <span>
                        <span class="app-conversion-cta">Lorem Ipsum Veratis !</span>
                    </span>
                </div>
            </div>
            <div class="app-navlinks" v-else>
                <span class="app-navlink-item app-navlink-desktop-hidden" @click="openSearch">
                    <span class="material-icons">
                        search
                    </span>
                    <span class="app-navlink-item-text">
                        Search
                    </span>
                </span>
                <span class="app-navlink-item" @click="$router.push('/orders')">
                    <span class="material-icons">
                        receipt
                    </span>
                    <span class="app-navlink-item-text">
                        Orders
                    </span>
                </span>
                <span class="app-navlink-item" @click="$router.push('/me/favourites')">
                    <span class="material-icons">
                        favorite
                    </span>
                    <span class="app-navlink-item-text">
                        Favourites
                    </span>
                </span>
                <span class="app-navlink-item" @click="openCart">
                    <span class="material-icons">
                            shopping_cart
                    </span>
                    <span class="app-navlink-indicator">{{userCart.cart_items.length}}</span>
                    <span class="app-navlink-item-text">
                        Cart
                    </span>
                </span>
                <span class="app-navlink-item" @click="$router.push('/settings/profile_details')">
                    <span class="material-icons">
                        more_vert
                    </span>
                    <span class="app-navlink-item-text">
                        Settings
                    </span>
                </span>
            </div>
            <span>
                <span class="navbar-menu-icon" @click="openMenu">
                    <svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" width="35" height="35" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m11 16.745c0-.414.336-.75.75-.75h9.5c.414 0 .75.336.75.75s-.336.75-.75.75h-9.5c-.414 0-.75-.336-.75-.75zm-9-5c0-.414.336-.75.75-.75h18.5c.414 0 .75.336.75.75s-.336.75-.75.75h-18.5c-.414 0-.75-.336-.75-.75zm4-5c0-.414.336-.75.75-.75h14.5c.414 0 .75.336.75.75s-.336.75-.75.75h-14.5c-.414 0-.75-.336-.75-.75z" fill-rule="nonzero"/></svg>
                </span>
            </span>
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
                                :addons="cItem.item.addons"
                            />
                        </MazListItem>
                    </MazList>
                </div>
            </template>
            <template v-slot:footer_btn>
                <MazBtn color="black"
                :loading="state.cartLoading"
                v-if="userCart.cart_items.length > 0"
                @click="checkoutUserCart"
                >Checkout - {{ userCart.cart_total }}</MazBtn>
            </template>
        </SlideDrawerVue>
        <SlideDrawerVue
        @hideModal="closeMenu" 
        :showModal="state.menuOpen"
        :showCloseLoading="false"
        :modalTitle="''"
        :slidePos="'right'"
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
                        <div class="full-width" v-if="$auth.loggedIn === true">
                            <MazBtn color="black" outline size="mini" @click="userLogout">Log Out</MazBtn>
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
    emits:[
        'deviceChange'
    ],
    components:{
        AppLogo,
        SlideDrawerVue,
        CartCheckoutCardVue,
    },
    props:[
        'pageLoading',
        'forceCartShow'
    ],
    data(){
        return {
            search:{
                request_count:0,
                input:"",
                lastSearch:"",
                lastRejectedSearch:"",
                restrict:false,
                autocomplete:{
                    results:{
                        products:[],
                        store:[],
                    }
                }
            },
            state:{
                cartOpen:false,
                cartLoading:false,
                menuOpen:false,
                autocompleteOpen:false,
                autocompleteSearching:false,
                autoCompleteEmpty:false,
                searchAreaOpen:false,
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
            },
            device:{
                location:{
                    lat:0,
                    lng:0,
                }
            }
            
        }
    },
    async mounted(){
        this.identifyMountLocation();
        let res = await this.fetchUserCart();
    },
    watch:{
        pageLoading(newVal,oldVal){
            if(newVal === false){
                this.userDelayAction(async ()=>{
                    //await this.fetchUserCart()
                }, 400)
            }
        },
        forceCartShow(newVal,oldVal){
            if(newVal === true){
                this.openCart();
            }else{
                this.closeCart();
            }
        }
    },
    methods:{
        openSearch(){
            this.state.searchAreaOpen = true;
        },
        closeSearch(){
            this.state.searchAreaOpen = false;
        },
        resetSearch(){
            this.search.input = "";
            this.state.autocompleteOpen = false;
            this.state.autocompleteSearching = false;
        },
        openCart(){
            this.cartOpen = false;
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
        userLogout(){
            this.closeMenu();
            this.userDelayAction(()=>{
                this.$auth.logout();
            },200)
        },
        identifyMountLocation(){
            //Identifies device details for entire application 
            let location = navigator.geolocation.getCurrentPosition((pos)=>{
                const { latitude  , longitude } = pos.coords;
                //Set location 
                this.device.location.lat = latitude;
                this.device.location.lng = longitude;
                this.$emit('deviceChange', this.device)
            });    
        },
        toggleAutocompleteArea(){
            let input = this.search.input;
            this.state.autocompleteOpen = input.length > 0 ? true : false;
        },
        async searchBarMonitor(ev){
            this.toggleAutocompleteArea();
            let input = this.search.input;
            if(input.length%3 === 0 || input.length === 1){
                await this.searchBarQuery()
            }
        },
        async searchBarQuery(){
            if(this.search.request_count >= 12){
                this.$toast.open({
                    message:"Please try again later",
                    type:'error'
                });
                setTimeout(()=>{
                    this.search.request_count = 0;
                }, 2300)
                return 
            }
            if(this.state.autocompleteSearching){ return }
            this.state.autocompleteSearching = true;
            let url = process.env.NUXT_ENV_CLIENT_INPUT_SEARCH;
            await this.$axios.$get(url, {
                params:{
                    search:this.search.input,
                }
            }).then(data=>{
                this.search.autocomplete.results.store = data.store;
                this.search.autocomplete.results.products = data.products;
                if(data.store.length === 0 && data.products.length === 0){
                    this.search.restrict = true;
                    this.search.lastRejectedSearch = this.search.input;
                }else{
                    this.search.restrict = false;
                }
                setTimeout(()=>{
                    this.search.lastSearch = this.search.input;
                    this.state.autocompleteSearching = false;
                }, 800)
            }).catch(err=>{
                this.$toast.open({
                    message:"Something went wrong. Please try again later",
                    type:"error",
                })
            });
            this.search.request_count = this.search.request_count + 1;
            setTimeout(()=>{
                this.state.autocompleteSearching = false;
            }, 600)
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
        },
        autocompleteResults(){
            let results = this.search.autocomplete.results;
            const { products , store } = results;
            return {    
                products,
                store,
            };
        },
        searchComponentClass(){
            let base_class = "app-search-wrapper"
            let active_class = "app-search-wrapper-active";
            let class__ = this.state.searchAreaOpen ? base_class + " " + active_class : base_class;
            return class__
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
        z-index:30;
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

    .app-search-wrapper-header{
        display:none;
    }

    .app-search-input-wrapper{
        position:relative;
        height:fit-content;
        width:fit-content;
    }

    .app-search-input{
        width:36em;
        height:45px;
        background:var( --app-platinum);
        padding-left:10%;
        font-size:var(--app-text-base);
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


    .app-search-results-wrapper{
        width:100%;
        position:absolute;
        top:110%;
        left:0%;
        height:65vh;
        background:var(--app-prim-light);
        box-shadow: rgba(0, 0, 0, 0.19) 0px 10px 20px, rgba(0, 0, 0, 0.23) 0px 6px 6px;
    }

    .app-search-results-container{
        width:100%;
        height:100%;
        overflow-y:scroll;
    }


    .app-search-autocomplete-wrapper{
        width:100%;
        display:flex;
        flex-direction:column;
    }

    .app-search-autocomplete-wrapper > *:nth-child(even){
        border-top:0.1px solid var(--app-platinum);
        border-bottom:0.1px solid var(--app-platinum);
    }

    .app-search-autocomplete{
        width:100%;
        padding:1em 0.5em;
        display:flex;
        gap:1em;
        align-items:center;
        cursor:pointer;
    }

    .app-search-autocomplete:hover{
        background:#eeee;
    }

    .app-autocomplete-result-text{
        font-size:var(--app-text-base);
        font-weight:500;
        color:var(--app-prim-black);
        font-family:var(--app-heading-font);
    }

    .app-autocomplete-text-match{
        font-weight:600;
        color:var(--app-prim-black);
    }

    .app-search-autocomplete .material-icons{
        font-size:var(--app-text-lg)
    }

    .autocomplete-result-placeholder{
        height:26px;
        width:100%;
    }

    .app-search-empty-results-wrapper{
        width:100%;
        height:100%;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        gap:1em;
    }

    .app-search-empty-results-wrapper .material-icons{
        font-size:var(--app-text-2xl);
    }
    
    .app-search-result-prompt{
        font-size:var(--app-text-lg);
        font-weight:500;
    }

    .autocomplete-subtitle{
        font-weight:600;
        font-size:var(--app-text-xs);
        color:var(--app-prim-black);
        text-transform:capitalize;
    }
    .app-navlinks{
        gap:1em;
        display:flex;
        width:22em;
        justify-content:flex-end;
        position:relative;   
    }

    .app-conversion-banner{
        width:100%;
        height:100%;
        position:absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
        background:#F7EF81;
        display:flex;
        justify-content:center;
        align-items:center;
        padding:0.4em 0.6em;
    }

    .app-conversion-cta{
        font-size:var(--app-text-lg);
        font-weight:600;
        color:var(--app-prim-black);
    }

    .app-navlink-item{
        height:100%;
        width:55px;
        display:flex;
        flex-direction:column;
        align-items:center;
        justify-content:center;
        gap:0.2em;
        position:relative;
        cursor:pointer;
        user-select:none;
    }

    .app-navlink-desktop-hidden{
        display:none;
    }

    .app-navlink-item .material-icons{
        font-size:var(--app-text-2xl);
    }

    .app-navlink-item-text{
        font-size:calc(var(--app-text-xs)*0.75);
    }

    .app-navlink-indicator{
        width:20px;
        height:20px;
        background:var(--maz-primary);
        color:var(--app-prim-light);
        border-radius:999px;
        font-size:var(--app-text-xs);
        display:flex;
        justify-content:center;
        align-items:center;
        position:absolute;
        top:0%;
        left:50%;
        transform:translate(30%, -10%);
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
            top:100%;
            left:0%;
            height:100%;
            width:100%;
            background:var(--app-prim-light);
            z-index:999;
            transition:0.3s ease-in-out;
        }

        .app-search-wrapper-active{
            top:0%;
        }

        .app-search-wrapper-header{
            display:flex;
            justify-content:flex-end;
            padding:0.4em 0.5em;
        }

        .app-search-input-wrapper{
            width:100%;
        }

        .app-search-input{
            width:100%;
        }

        .app-search-results-wrapper{
            position:static;
            width:100%;
            box-shadow:none;
            height:80vh;
        }

        .app-navlinks{
            position:fixed;
            height:80px;
            left:0px;
            right:0px;
            bottom:0px;
            width:100%;
            background:var(--app-prim-black);
            display:grid;
            grid-template-columns:repeat(5,1fr);
        }

        .app-navlink-item{
            width:100%;
            height:100%;
        }

        .app-navlink-desktop-hidden{
            display:flex;
        }

        .app-navlink-item .material-icons{
            font-size:var(--app-text-2xl);
            color:var(--app-prim-light)
        }
        
        .app-navlink-item-text{
            font-size:calc(var(--app-text-xs)*0.75);
            color:var(--app-prim-light)
        }

        .app-navlink-indicator{
            width:20px;
            height:20px;
            transform:translate(20%, -2%);
        }
    }
</style>