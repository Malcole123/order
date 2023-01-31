<template>
    <MainWrapper>
      <template v-slot:navbar>
          <ApplicationNavbarVue
          :pageLoading="state.navLoading"
          @deviceChange="setLocationDetails"
          />
      </template>
      <template v-slot:body>
        <div class="page-banner" v-if="successLoad === true">
            <img :src="bannerMedia.banner" :alt="''" class="store-view-banner-img" v-if="successLoad === true">
        </div>
        <div class="app-container-fluid bg-white" v-if="successLoad === true">
            <div class="store-view-header">
                <h1 class="store-view-heading">{{ pageData.name.long }}</h1>
                <MazBtn
                :color="'black'"
                size="mini"
                v-if="pageData.store_type === 'supermarket'"
                @click="toggleGroceryListDraw"
                >
                Create Shopping List
                </MazBtn>
            </div>
            <div class="store-view-body-wrapper" v-if="state.storeSearchOpen === false">
                <div class="store-product-filters">
                
                      <div class="store-product-filters-container">
                        <div class="full-width store-filter-mobile-hidden">
                          <MazCollapse color="black">
                                        <div slot="header-text" style="width:100%">
                                              Sell Categories
                                        </div>    
                                        <div class="store-product-filter-item" 
                                        v-for="(cat,index) in pageData.sell_categories" :key="'sel-item-'+index"
                                        :data-sel-index="cat.name"
                                        @click="goToSection(cat.name)"
                                        >
                                            {{ cat.name }}
                                        </div>                                                             
                          </MazCollapse>
                     
                        </div>
                        <MazCollapse color="black">
                                        <div slot="header-text" style="width:100%">
                                          Store Locations
                                        </div>    
                                        <div class="full-width component-padding" 
                                        >
                                           <RestaurantLocationCardVue
                                           v-for="(location,l_index) in pageData.measured_locations"
                                           :key="`measured-location-${l_index}`"
                                            :distance="location.distance"
                                            :title="location.name"
                                            :store_location="location.exact_location.data"
                                            :user_location="user.location"
                                           />
                                     
                                        </div>                                                             
                        </MazCollapse>
                      </div>
                </div>
                <div class="store-product-display">
                  <div class="store-product-section-wrapper" v-for="(sect,i) in displayData.products" 
                  :id="sect.section_id"
                  :key="'prodsection-'+ i">
                      <h2 class="store-product-display-heading">{{ sect.section_details.name }}</h2>
                      <div class="store-product-display-section">
                        <SquareDisplayCard 
                        v-for="(prod, index) in sect.results" 
                        :key="'product-item'+ index" 
                        :image="prod.image"
                        :title="prod.name.short"
                        :desc="prod.description"
                        :reviews="[]"
                        @click="$router.push(`/store/${storeReference}/${prod.product_uuid}`)"
                          
                      />
                      </div>
                  </div>
            
                </div>
            </div>
        </div>
        <div :class="storeSearchComponent.parent_class" v-if="successLoad === true">
          <div class="full-width app-flex app-container-fluid" style="justify-content:flex-end;">
            <MazBtn color="black" size="mini" @click="toggleStoreSearchView(false)">Close</MazBtn>
          </div>
            <div class="full-width store-search-display-container app-container-fluid"
            >
              <div class="full-width app-flex app-flex-column app-lg-spacing">
                  <div class="full-width app-flex app-flex-column app-md-spacing"
                  v-for="(item,index) in displayData.search_results"
                  :key="`search-section-${index}`"
                >
                    <div class="full-width">
                        <span class="store-search-heading">
                            Results for " {{ item.name }} "
                        </span>
                    </div>
                    <div class="full-width store-search-results-wrapper">
                      <div class="full-width" v-for="(result,i) in item.results" :key="`result-item-${i}`">
                          <SquareDisplayCard
                          :image="result.image"
                          :title="result.name.short"
                          :desc="result.description"
                          />
                      </div>
                    </div>
                  </div>

              </div>
            </div>
        </div>
        <SlideDrawerVue
        :showModal="state.drawOpen"
        >
          <template v-slot:slide_draw_body_full>
            <div class="full-width">
                <GroceryListSearchVue
                :storeID="pageData.id"
                @fetchSuccess="groceryFetchSuccess"
                >
                  <template v-slot:header_slot_right>
                      <MazBtn 
                      color="black"
                      size="mini"
                      @click="toggleGroceryListDraw"
                      >Close</MazBtn>
                  </template>
                </GroceryListSearchVue>
            </div>
          </template>
        </SlideDrawerVue>
        <SvgLoaderVue
          :showLoader="state.showLoader"
          @loaderShown="pageLoadSequence"
        />
      </template>
      <template v-slot:footer>
        <StandardFooter/>
      </template>
    </MainWrapper>
 
</template>

<script>
import ApplicationNavbarVue from '~/components/Navbars/ApplicationNavbar.vue';
import MainWrapper from '~/components/Wrapper/MainWrapper.vue';
import SquareDisplayCard from '~/components/Cards/DisplayCards/SquareDisplayCard.vue';
import RestaurantLocationCardVue from '~/components/Cards/DisplayCards/RestaurantLocationCard.vue';

import StandardFooter from '~/components/Footers/StandardFooter.vue';
import SlideDrawerVue from '~/components/Modals/SlideDrawer.vue';
import SvgLoaderVue from '~/components/PageLoaders/SvgLoader.vue'
import GroceryListSearchVue from '~/components/ActionComponents/GroceryListSearch.vue';

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
    RestaurantLocationCardVue,
    StandardFooter,
    SlideDrawerVue,
    GroceryListSearchVue,
    SvgLoaderVue,
  },
  async asyncData({isDev, $axios ,route, store, env, params, query, req, res, redirect, error}) {
     
  },
  fetchOnServer:false,
  async fetch(){

  },
  data(){
    return {
        state:{
            navLoading:false,
            showLoader:true,
            pageLoading:true,
            drawLoading:false,
            drawOpen:false,
            storeSearchOpen:false,
        },
        scrollSpy:{
            id:0,
        },
        displayData:{
            products:[], //displays formatted results on page load
            search_results:[],
        },
        user:{
          location:{
            set:false,
            lat:0,
            lng:0,
          }
        },
        successLoad:false,
        pageData:{}
    }
  },
  computed:{
    bannerMedia(){
        const { promotional } = this.pageData;
        if(promotional === undefined){
            return {
                banner:"",
                logo:"",
            }
        }else{
            try{
                const { image } = promotional;
                return {
                    banner:image.bannerImage.url || "",
                    logo:image.storeLogo.url || "",
                }
            }catch(err){
                return {
                    banner:"",
                    logo:"",
                }
            }
        }
    },
    storeSearchComponent(){
      let parent_arr = ["store-search-display-wrapper"];
      if(this.state.storeSearchOpen === true){
        parent_arr.push('store-search-display-wrapper-active')
      }
      let parent_class = parent_arr.join(' ')
      return {
        parent_class,
      }
    },
  },
  methods:{
    async pageLoadSequence(){
      this.userDelayAction(async ()=>{
        let set_data = await this.fetchPageResults();
          if(set_data.ok){
            this.successLoad = true;
            this.pageData = set_data.data;
            this.formatPageResults();
            this.state.pageLoading = false;
            this.userDelayAction(()=>{
                this.state.showLoader = false;
            }, 900)
          }else{

          }


      },300)        
    },
    scrollObserve(index){
        let class_ = "store-product-filter-active";
        if(index === this.scrollSpy.id){
            return class_
        }else{
            return "";
        }
    },
    async fetchPageResults(){
      let url = process.env.NUXT_ENV_STORE_IDENTIFY_URL;
        let ref = this.$route.params.store_reference;
      if(ref === undefined){ return { ok:false }}
       let dt = await this.$axios.$get(url, {
            progress:false,
            params:{
                location:{
                lat:this.user.location.lat,
                lng:this.user.location.lng,
            },
            reference:ref,
            }
        }).then(data=>{
          console.log(data)
            return { 
              ok:true,
              data,
            }
        }).catch(err=>{
          console.log(err)
            return {
              ok:false,
            }
        });
        return dt;
    },
    formatPageResults(){
        //Detect store sell categories
        let sell_categories = this.pageData.sell_categories;
        let return_arr = [];
        let empty_cats = [];
        sell_categories.forEach((item,index)=>{
            //Set category heading and results
            let section_name_id = item.name.replaceAll(" ", "");
            let section_id = `order-search-section-${section_name_id}`
            let section_obj = {
                section_id:section_id,
                section_details:item,
                results:this.pageData.all_products.filter((prod,i)=>{
                    if(prod.sell_category.includes(item.name)){
                        return prod
                    }
                })
            };
            return_arr.push(section_obj);
            if(section_obj.results.length === 0 ){
              empty_cats.push(index)
            }
        })
        //Set results 
        this.displayData.products = return_arr.filter((item,index)=>{
            if(item.results.length >= 1){
                return item ;
            }
        });
        //console.log(this.pageData)
        //Removes empty for sell categories
        this.pageData.sell_categories = this.pageData.sell_categories.filter((item,index)=>{ if(empty_cats.includes(index) !== true){ return item }})
        //Filter sell categories
    },
    userDelayAction(callback, time){
        try{
            setTimeout(()=>{
                callback();
            },time)
        }catch(err){
            return false
        }
    },
    toggleGroceryListDraw(){
      this.state.drawOpen = !this.state.drawOpen;
    },
    groceryFetchSuccess(data){
        this.displayData.search_results = data.results;
        this.userDelayAction(()=>{
          this.toggleStoreSearchView(true)
          this.toggleGroceryListDraw()
        }, 300)
    },
    toggleStoreSearchView(state){
      this.state.storeSearchOpen = state;
    },
    goToSection(section_name){
      let elIdName = section_name.replaceAll(" ", "");
      let elId = `order-search-section-${elIdName}`;
      let element = document.getElementById(elId);
      console.log(element)
      if(element !== null && element !== undefined){ return }
      //let section name 
      element.scrollIntoView({
          behaviour:'smooth',
          block:'end',
      })
    },
    setLocationDetails(data){
        try{
          this.user.location.lat = data.location.lat;
          this.user.location.lng = data.location.lng;
          this.user.location.set = true;
          console.log(this.user)
          return true
        }catch(err){
          return false
        }
    }

    
  }
}
</script>

<style>
.page-banner{
  width:100%;
  height:25vh;
  background:var(--app-platinum);
  position:relative;
}

.store-view-banner-img{
    width:100%;
    height:100%;
    object-fit:cover;
}

.store-view-header{
  width:100%;
  top:70px;
  padding:0.8em 0em;
  display:flex;
  justify-content:space-between;
  align-items:flex-start;
}

.store-view-heading{
  font-size:calc(1.3 * var(--app-text-xl));
  font-weight:600;
  font-family:var(--app-heading-font);
  margin:0px;
}

.store-view-body-wrapper{
  width:100%;
  display:grid;
  grid-template-columns:1fr 3fr;
  gap:0.5em;
}

.store-product-filters{
  width:100%;
}

.store-product-filters-container{
  position:sticky;
  top:68px;
  width:100%;
  height:fit-content;
  background:var(--app-prim-light);
  display:flex;
  flex-direction:column;
  gap:1em;
  border:0.001em solid var(--app-platinum);
  padding:1em 0.8em;
}

.store-product-filter-item{
  font-size:var(--app-text-base);
  font-weight:500;
  cursor:pointer;
  width:fit-content;
  position:relative;
  transition:0.3s ease-in-out;
  padding-top:0.6em;
  padding-bottom:0.6em;
  padding-left:0.4em;
}

.store-product-filter-item::after{
  content:"";
  display:block;
  width:0%;
  height:2px;
  background:var(--app-prim-black);
  position:absolute;
  top:105%;
}


.store-product-filter-active::after{
  width:100%;
}

.store-product-display{
  display:flex;
  flex-direction:column;
  gap:3em;
  width:100%;
}


.store-product-section-wrapper{
  display:flex;
  flex-direction:column;
  gap:0.5em;
  width:100%;
}

.store-product-display-heading{
  font-size:var(--app-text-lg);
  font-weight:700;
  margin:0px;
  font-family:var(--app-heading-font)
}

.store-product-display-section{
  display:grid;
  grid-template-columns:repeat(4,1fr);
  gap:0.5em;
}


.store-search-display-wrapper{
  width:100%;
  position:absolute;
  top:0;
  left:0;
  right:0;
  min-height:90%;
  padding-top:90px;
  background:var(--app-prim-light);
  display:none;
}

.store-search-display-wrapper-active{
  display:block;
  height:fit-content;
}

.store-search-display-container{
  width:100%;
  display:grid;
  grid-template-columns:5fr 1fr;
  gap:1em;
}


.store-search-heading{
  font-size:var(--app-text-xl);
  font-weight:600;
  color:var(--app-prim-black);
}


.store-search-results-wrapper{
  width: 100%;
  display:grid;
  grid-template-columns:repeat(5,1fr);
  gap:1em;
}


@media (max-width:992px) {
  .store-view-body-wrapper{
    grid-template-columns:1fr;
    gap:1em;
  }

  .store-product-filters-container{
    display:grid;
    grid-template-columns:1fr;
    width:100%;
    position:fixed;
    top:auto;
    position:fixed;
    bottom:0%;
    left:0%;
    right:0%;
    z-index:4;
  }

  .store-filter-mobile-hidden{
    display:none;
  }

  .store-product-display-section{
    grid-template-columns:repeat(2,1fr);
  }

  .store-search-display-container{
    grid-template-columns:1fr;
  }


  .store-search-results-wrapper{
    grid-template-columns:repeat(2,1fr);
  }

}
</style>
