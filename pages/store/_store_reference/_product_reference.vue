<template>
    <MainWrapper>
      <template v-slot:navbar>
          <ApplicationNavbarVue
            :pageLoading="state.pageLoading"
            :forceCartShow="state.showCart"
          />
      </template>
      <template v-slot:body>
        <div class="app-container bg-white" v-if="successLoad">
            <div class="product-view-body-wrapper">
                <div class="product-view-media-wrapper">
                    <div class="product-view-img product-view-img-primary">
                        <img :src="displayData.imageUrl" :alt="''">
                    </div>
                </div>
                <form class="product-view-description-wrapper" @submit.prevent="addCartItem" v-if="state.pageLoading === false">
                    <div class="product-view-desc-container">
                            <div class="product-addon-header">
                                <span class="product-addon-heading">Select Type</span>
                            </div>
                            <div class="full-width">
                                <MazSelect
                                :color="'black'" 
                                :options="menuSelection.selection_options.selections" 
                                :listWidth="'100%'" 
                                @input="updateSelectedItem"
                                :placeholder="'Required *'"
                                :value="userForm.selected_item_ref"
                                :multiple="false"
                                :config="menuSelection.selection_options.config"
                                />
                            </div>
                            <div class="product-view-desc-container app-mt-1" v-if="displayData.description.length > 0">
                                <p class="product-view-description">
                                    <MazReadMore 
                                        :text="displayData.description"
                                    />
                                </p>
                                <h2 class="product-view-price">{{ displayData.priceStr }}</h2>
                            </div>
                    </div>

                    <div class="product-view-desc-container">
                            <div class="product-addon-header">
                                <span class="product-addon-heading">Order Details</span>
                            </div>
                            <div class="full-width quantity-sel-section">
                                <span class="product-addon-heading">Quantity</span>
                                <div class="full-width app-mt-1" style="max-width:100%;overflow:hidden;">
                                    <MazPagination
                                    style="justify-content:flex-start;width:100%;"
                                    :dark="true"
                                    v-model="userForm.quantity"
                                    :page-count="32"
                                    :pageRange="3"
                                    />
                                </div>
                            </div>
                            <div class="full-width app-mt-2">
                                <span class="product-addon-heading">Special Instructions</span>
                                <div class="full-width app-mt-1">
                                    <MazInput
                                        color="black"
                                        placeholder="e.g. No pickles"
                                        autocomplete="new-comment"
                                        left-icon-name="comment"
                                        textarea
                                        v-model="userForm.special_instructions"
                                    />
                                </div>
                         
                            </div>
                          
                    </div>

                    <div class="product-view-desc-container" v-if="userForm.additions.length > 0">
                            <div class="product-addon-header">
                                <span class="product-addon-heading">Customize Your Order</span>
                            </div>
                            <div class="full-width">
                                <div class="product-view-addon-select" v-for="(addon,index) in userForm.additions" :key="'addon-item-'+index">
                                    <MazCollapse color="black">
                                        <div slot="header-text" style="width:100%">
                                            <div class="" @click="toggleSectionCollapse(index)">
                                                <span class="product-addon-heading">{{ addon.name }}</span>
                                            </div>
                                        </div>                             
                                        <div class="product-addon-body">
                                            <MazList :noShadow="true" :rounded="false" :noScroll="true">
                                                <MazListItem v-for="(opt,i) of addon.display_options" :key="index + '-addom-item-'+ i">
                                                        <div class="product-addon-option">
                                                            <div class="product-addon-text-content">
                                                                <span class="product-addon-option-heading">
                                                                    {{ opt.name }}
                                                                </span>
                                                                <span class="product-addon-option-sub-heading">
                                                                    {{ priceFormatter(opt.price.amount,opt.price.currency) }}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <div v-if="opt.max_add === 1">
                                                                    <MazCheckbox color="black" v-model="opt.item_selected" @input="selectAddonOption"/>
                                                                </div>
                                                                <div v-else style="width:120px;">
                                                                    <MazInput
                                                                    placeholder="Select Quantity"
                                                                    type="number"
                                                                    :min="0"
                                                                    color="black"
                                                                    :disabled="true"
                                                                    :id="`item-quantity-input-${i}`"
                                                                    v-model="opt.quantity"
                                                                    style="background:#fff;color:#000;text-align:center;"
                                                                    >
                                                                        <template v-slot:icon-left>
                                                                            <div  @click="decreaseAddonQuantity(opt, `item-quantity-input-${i}`)">
                                                                                <svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m12.002 2.005c5.518 0 9.998 4.48 9.998 9.997 0 5.518-4.48 9.998-9.998 9.998-5.517 0-9.997-4.48-9.997-9.998 0-5.517 4.48-9.997 9.997-9.997zm4.253 9.25h-8.5c-.414 0-.75.336-.75.75s.336.75.75.75h8.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75z" fill-rule="nonzero"/></svg>
                                                                            </div>
                                                                        </template>
                                                                        <template v-slot:icon-right>
                                                                            <div @click="increaseAddonQuantity(opt, `item-quantity-input-${i}`)">
                                                                                <svg clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m12.002 2c5.518 0 9.998 4.48 9.998 9.998 0 5.517-4.48 9.997-9.998 9.997-5.517 0-9.997-4.48-9.997-9.997 0-5.518 4.48-9.998 9.997-9.998zm-.747 9.25h-3.5c-.414 0-.75.336-.75.75s.336.75.75.75h3.5v3.5c0 .414.336.75.75.75s.75-.336.75-.75v-3.5h3.5c.414 0 .75-.336.75-.75s-.336-.75-.75-.75h-3.5v-3.5c0-.414-.336-.75-.75-.75s-.75.336-.75.75z" fill-rule="nonzero"/></svg>
                                                                            </div> 
                                                                        </template>
                                                                    </MazInput>
                                                                </div>
                                                            </div>
                                                        </div>
                                                </MazListItem>
                                            </MazList>
                                        </div>
                                    </MazCollapse>
                                </div>
                            </div>
                            <div class="full-width app-mt-1" v-if="displayData.included_items.includes('drink')">
                                <div class="product-view-addon-select">
                            <MazCollapse color="black">
                                <div slot="header-text" style="width:100%">
                                    <div class="full-width">
                                        <span class="product-addon-heading">Drink Selections - {{ userForm.drinks_selected }} of {{ drinkDecisions.maxSelect }} Selected</span>
                                    </div>
                                </div>                             
                                <div class="product-addon-body">
                                    <MazList :noShadow="true" :rounded="false" :noScroll="true">
                                        <MazListItem v-for="(drink,i) of userForm.drink_selections" :key="'drink-selitem-'+ i">
                                                <div class="product-addon-option">
                                                    <div class="product-addon-text-content">
                                                        <span class="product-addon-option-heading">
                                                            {{ drink.name }}
                                                        </span>
                                                        <span class="product-addon-option-sub-heading">
                                                            
                                                        </span>
                                                    </div>
                                                    <MazCheckbox color="black" 
                                                    v-model="drink.isSelected" 
                                                    @input="selectDrink"
                                                    />
                                                    <div class="product-addon-option-disabled" v-if="drinkDecisions.restrict && drink.isSelected === false">

                                                    </div>
                                                </div>
                                        </MazListItem>
                                    </MazList>
                                </div>
                            </MazCollapse>
                    </div>
                            </div>
                          
                    </div>
                  
                    <MazBtn color="black" type="submit" :loading="userForm.processing">    
                        Add To Cart - {{ selectionTotal }}
                    
                    </MazBtn>
                </form>  
            </div>
        </div>
      </template>
      <template v-slot:footer>
          <StandardFooterVue/>
      </template>
    </MainWrapper>
 
</template>

<script>
import ApplicationNavbarVue from '~/components/Navbars/ApplicationNavbar.vue';
import MainWrapper from '~/components/Wrapper/MainWrapper.vue';
import SquareDisplayCard from '~/components/Cards/DisplayCards/SquareDisplayCard.vue';
import StandardFooterVue from '~/components/Footers/StandardFooter.vue';


export default {
auth:false,
  name: 'StorePage',
  head(){
    return {
      title:"",
    }
  },
  components:{
    MainWrapper,
    ApplicationNavbarVue,
    SquareDisplayCard,
    StandardFooterVue,
  },
  async asyncData({$axios, route, store, env, params, query, req, res, redirect, error}) {
        let url = process.env.NUXT_ENV_PRODUCT_IDENTIFY_URL;
        let prod_ref = params.product_reference;
        if(prod_ref === undefined){ return { successLoad:false}}
        let xReq = await $axios.$get(url, {
            progress:false,
            params:{
                product_reference:prod_ref,
            }
        }).then(data=>{
            return {
                successLoad:true,
                pageData:data,
            }
        }).catch(err=>{
            return {
                successLoad:false,
            }
        });
        return xReq;
  },
  data(){
    return {
        userForm:{
            processing:false,
            selected_item_ref:null,
            quantity:1,
            drinks_selected:0,
            additions:[],
            selected_addons:[],
            drink_selections:[],
            special_instructions:"",
            price:{
                unit_price:{
                    currency:"",
                    amount:0,
                    price_str:"",
                },
                addonPrice:[
                    {
                        currency:"",
                        amount:0,
                    }
                ]
            }
        },
        menuSelection:{
            selection_options:{
                config:{
                "labelKey":"name",
                "valueKey":"variant_reference",
                "searchKey":"name"},
                selections:[], //Schema follows maz-ui select component 
                quantity:[
                { label: '1', value: 1 },
                { label: '2', value: 2 },
                { label: '3', value: 3 },
                { label: '4', value: 4 },
                { label: '5', value: 5 },
                { label: '6', value: 6 },
                { label: '7', value: 7 },
                { label: '8', value: 8 },
                ]
            }
        },
        displayData:{
            priceStr:"",
            description:"",
            imageUrl:"",
            included_items:[],
        },
        state:{
            pageLoading:true,
            showCart:false,
        }
    }
  },
  fetchOnServer:false,
  fetch(){
    this.userDelayAction(()=>{
            //Change to check function later
        this.displayData.imageUrl = this.pageData.image.url;
        this.dataTransform();
        this.setDrinkSelections();
        this.updateSelectedItem(this.pageData.variants[0].variant_reference);
        this.state.pageLoading = false;
    },1200)
  },
  methods:{
    async addCartItem(){
        this.userForm.processing = true;
        if(this.$auth.loggedIn === false){
            this.$router.push('/auth/login/buyer')
            return 
        }
        let addons = this.userForm.selected_addons.map((item,index)=>{
            return {
                addon_ref:item.addon_ref,
                quantity:item.quantity,
                description:"",
                price:item.price,
            }
        })

        let drink_selections = this.userForm.drink_selections.map((item,index)=>{
            return item.product_reference;
        });
        let res = await this.$store.dispatch('user/addCartItem', {
            product_reference:this.pageData.product_uuid,
            special_instruction:this.userForm.special_instructions,
            quantity:this.userForm.quantity,
            drink_selections,
            addons,
            variant_reference:this.userForm.selected_item_ref,
        });
        if(res.ok){
            this.userDelayAction(()=>{
                this.userForm.processing = false;
                this.userDelayAction(()=>{
                    this.state.showCart = true;
                },400)
            },1200)
        }else{
            this.userDelayAction(()=>{
                this.userForm.processing = false;
            },1200)
        }
    },
    updateSelectedItem(value){
        if(value !== null){
            this.userForm.selected_item_ref = value;
            this.getDataFromVariant()
        }
    },
    dataTransform(){
        let data = this.pageData;
        if(data === undefined){ return }
        console.log(data)
        const { variants } = data;
        if(variants === undefined) { return }
        //this.menuSelection.selection_options.selections = [{'name':'none','variant_reference':null}]
        this.menuSelection.selection_options.selections.push(...variants);
    },
    getDataFromVariant(){
        let variants = this.pageData.variants;
        //Finds variant from selection reference in select input
        variants.find((item,index)=>{
            if(item.variant_reference === this.userForm.selected_item_ref){
                const { name , description, image, currency, amount} = item;
                let price_str = this.priceFormatter(amount, currency)
                if(name != undefined && description !== undefined && image !== undefined){
                    //Sets display data from selection for display
                    this.setDisplayData({
                        description:description.length > 0 ? description : 'No description provided',
                        imageUrl:typeof image === 'object' && image !== null? image.url : "",
                        priceStr:price_str,
                        included_items:item.included_items,
                    });
                    //Sets addon data to ui for user selection 
                    this.setAddOnData()
                    //Set price selection price
                    this.setSelectionUnitPrice({
                        currency:currency,
                        amount:amount,
                    })
                }
            }
        });
    },
    setDisplayData({priceStr, description, imageUrl, included_items}){
        this.displayData.description = description;
        this.displayData.imageUrl = imageUrl.length === 0 && this.displayData.imageUrl.length > 0 ? this.displayData.imageUrl : imageUrl;
        this.displayData.priceStr = priceStr;
        this.displayData.included_items = included_items;
    },
    setAddOnData(){
        //Sets form data from page data to be used for checkout
        let addons = this.pageData.addons;
        this.userForm.additions = addons.map((item,index)=>{
            item.item_selected = false;
            item.quantity = 1;
            const { options } = item;
            if(options === undefined) {
                item.successEdits = false;
            }
            let set_options = [...options].filter((opt,index)=>{
                if(opt.restrict_to.length === 0 || opt.restrict_to.includes(this.userForm.selected_item_ref)){
                    return item ;
                }
            });
            item.display_options = set_options;
            return item;
        }).filter((item,index)=>{
            if(item.display_options.length > 0){
                return item;
            }
        })
    },
    setSelectionUnitPrice({currency, amount }){
        this.userForm.price.unit_price.currency = currency;
        this.userForm.price.unit_price.amount = amount;
        this.userForm.price.unit_price.price_str = this.priceFormatter(amount , currency)
    },
    setAddonPriceArray(){
        let addons = this.userForm.selected_addons;
        let price_array = [...addons].map((item,index)=>{
            const { quantity, item_selected, price } = item; 
            //Uses quantity if defined and 1 if not 
            let use_quantity = quantity || 1;
            let use_price = price || { amount:0 , currency:'JMD'};
            let use_total = use_quantity * use_price.amount;
            return {
                amount:use_total,
                currency:use_price.currency,
            };
        });
        this.userForm.price.addonPrice = price_array;
    },
    priceFormatter(amt,currency){
        let use_currency = currency || 'JMD';
        let use_amt = amt || 0;
        let options = {style:'currency',currency:use_currency};
        let formatter = new Intl.NumberFormat('en-US', options);
        return formatter.format(use_amt)
    },
    setDrinkSelections(){
        const { store } = this.pageData;
            try{
                if(store === undefined){ return [] }
                const { universal_products } = store;
                let return_arr = universal_products || [];
                this.userForm.drink_selections = return_arr.filter((item,index)=>{
                    if(item.product_type === "drink_selection"){
                        return item ;
                    }
                }).map((item,index)=>{
                    item.isSelected = false;
                    return item;
                });
            }catch(err){
                return []
            }
    },
    selectDrink(val){
        let items = [...this.userForm.drink_selections].filter((item,index)=>{
                if(item.isSelected === true){
                    return item;
                }
        });
        this.userForm.drinks_selected = items.length;
    },
    selectAddonOption(val){
        let data_ = this.userForm.additions;
        let clean_arr = [];
        let set_arr = []
        data_.forEach((item,index)=>{
            let opts_ = item.display_options.forEach((disp,i)=>{
                if((disp.quantity >= 1 || disp.item_selected === true ) && set_arr.includes(disp.addon_ref) === false){
                    clean_arr.push(disp);
                    set_arr.push(disp.addon_ref)
                }
            })
        });
        this.userForm.selected_addons = clean_arr;
        //Updates addon price array from selections
        this.setAddonPriceArray();
    },
    increaseAddonQuantity(addonItem, id){
        //Find if item is in array
        let setQuantity = 1;
        let found = this.userForm.selected_addons.find((item,index)=>{
            if(item.addon_ref === addonItem.addon_ref){
                item.quantity = item.quantity + 1;
                setQuantity = item.quantity;
                return item ;
            }
        })
        //If  not found
        if(found === undefined){
            addonItem.quantity = 1;
            this.userForm.selected_addons.push(addonItem)
        }else{
            
        }
        this.setAddonPriceArray()
        this.setNewValue(id, setQuantity )
    },
    decreaseAddonQuantity(addonItem, id){
        if(addonItem.quantity === 0){ return }
        //Find if item is in array
        let setQuantity = 1;
        let found = this.userForm.selected_addons.find((item,index)=>{
            if(item.addon_ref === addonItem.addon_ref){
                item.quantity = item.quantity - 1;
                setQuantity = item.quantity;
                return item ;
            }
        })
        this.setNewValue(id, setQuantity );
        this.setAddonPriceArray();
    },
    setNewValue(id, val){
        let input = document.getElementById(id);
        if(id === null || id === undefined){ return }
        input.value = val;

    },
    updateSelectQuantity(val){
        this.userForm.quantity = val;
       
    },
    //UI FORMATTER
    toggleSectionCollapse(index){
        let active_class = 'product-addon-visible';
        let el_ = document.getElementById(`product-addon-collapse-${index}`);
        if(el_ === null || el_ === undefined){ return }
        if(el_.classList.includes(active_class)){
            el_.className = `product-addon-body`;
            return 
        }else{
            el_.className = `product-addon-body ${active_class}`;
            return 
        }
        return 
    },
    userDelayAction(callback, time){
        try{
            setTimeout(()=>{
                callback();
            },time)
        }catch(err){
            return false
        }
    }
  },
  computed:{
        selectionDescription(){
            const { variants } = this.pageData;
        },
        drinkDecisions(){
            let items = [...this.userForm.drink_selections].filter((item,index)=>{
                if(item.isSelected === true){
                    return item;
                }
            });
            let restrict = this.userForm.quantity > this.userForm.drinks_selected ? false : true;
            return {
                maxSelect:this.userForm.quantity,
                currentSelect:items.length,
                restrict,
            }
        },
        selectionTotal(){
            //Enforce currency for single item for variants mandatory or wil break 
            let item_price = this.userForm.price.unit_price;
            let use_addon_total = 0;
            let addon_price_array = this.userForm.price.addonPrice;
            let addon_total = [...addon_price_array].map((item,index)=>{
                return item.amount;
            });
            if(addon_total.length > 0){
                use_addon_total = [...addon_total].reduce((prev,next)=>{ return prev + next });
            }
            //Item quantity total 
            let quantity_total = item_price.amount * this.userForm.quantity;
            let all_total = quantity_total + use_addon_total;
            let add_total_str = this.priceFormatter(all_total , item_price.currency);
            return add_total_str;
        },
  }
}
</script>

<style>
    .product-view-body-wrapper{
        width:100%;
        min-height:100vh;
        display:grid;
        grid-template-columns:repeat(2,1fr);
        padding-top:20px;
        padding-bottom:40px;
        gap:1em;
    }


    .product-view-media-wrapper{
        width:100%;
        height:100%;
    }

    .product-view-img img{
        width:100%;
        height:100%;
        object-fit:cover;
    }

    .product-view-img-primary{
        width:100%;
        height:65vh;
        background:var(--app-platinum);
        position:sticky;
        top:75px;
    }

    .product-view-description-wrapper{
        width:100%;
        display:flex;
        flex-direction:column;
        gap:2em;
    }

    .product-view-desc-container{
        display:flex;
        flex-direction:column;
        gap:0.8em;
    }

    .product-view-title{
        font-size:var(--app-text-xl);
        font-weight:600;
    }

    .product-view-price{
        font-size:var(--app-text-lg);
        font-weight:700;
    }

    .product-view-description{
        font-size:calc(var(--app-text-xs)*0.8);
        font-weight:300;
    }

    .product-addon-header{
        width:100%;
        height:fit-content;
        background:var(--app-platinum);
        padding:1em 0.3em;
        display:flex;
        justify-content:space-between;
        align-items:center;
    }

    .product-addon-body{
        padding:0.5em 0.3em;
    }

    .product-addon-visible{
        display:block;
    }

    .product-addon-heading{
        font-size:var(--app-text-base);
        font-weight:500;
    }

    .product-addon-option{
        padding:0.5em 0em;
        width:100%;
        display:flex;
        justify-content:space-between;
        position:relative;
    }

    .product-addon-option-disabled{
        height:100%;
        width:100%;
        position:absolute;
        top:0;
        left:0;
        right:0;
        bottom:0;
        background-color:rgba(255,255,255,0.4)
    }

    .product-addon-text-content{
        display:flex;
        flex-direction:column;
        gap:0.3em;
    }

    .product-addon-option-heading{
        font-size:var(--app-text-base);
        font-weight:400;
    }

    .product-addon-option-sub-heading{
        font-size:var(--app-text-xs);
        font-weight:300;
    }

    .quantity-sel-section  > .maz-btn--fab .active{
        background:var(--maz-third)!important;
    }

    @media (max-width:992px) {
        .product-view-body-wrapper{
            grid-template-columns:1fr; 
            gap:2em; 
        }
        
        .product-view-img-primary{
            height:40vh;
        }

    }
</style>
