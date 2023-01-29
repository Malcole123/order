<template>
    <div class="redeem-display-card" @click="$emit('click')">
        <div class="redeem-display-img">
            <img :src="cardImage" alt="">
        </div>
        <div class="redeem-display-content">
            <div class="full-width redeem-display-content-header component-padding">
                <span class="redeem-heading">
                    {{ title }}
                </span>
                <MazBtn 
                color="white" 
                size="mini"
                disabled
                >x {{ quantity }}</MazBtn>
            </div>
            <div class="full-width app-flex app-flex-column app-md-spacing">
                <div class="full-width component-padding app-flex app-flex-column app-md-spacing">
                    <div class="full-width" v-if="redeemDescription.length > 0">
                        <small><b>Description</b></small>
                        <p class="redeem-content-text">
                            {{ redeemDescription }}
                        </p>
                    </div>
                    <div class="full-width" v-if="redeemOrderInstructions.length > 0">
                        <small><b>Special Instructions</b></small>
                        <p class="redeem-content-text">
                            {{ redeemOrderInstructions }}
                        </p>
                    </div>
                   
                </div>
                <div class="full-width" v-if="redeemAddons.length > 0">
                   <div class="full-width component-padding">
                        <small><b>Addons</b></small>
                   </div>
                   <div class="full-width redeem-addon-wrapper">
                        <div class="redeem-addon-item component-padding"
                            v-for="(addon, index) in redeemAddons"
                            :key="`addon-item-${index}`"
                        >
                            <span>
                               {{ `${addon.quantity} x ${addon.name}` }}
                            </span>
                        </div>          
                   </div>
                </div>
                <div class="full-width component-padding">
                    <div class="full-width">
                        <small><b>Total Price</b></small>
                        <p>
                            <span class="redeem-order-price">{{ priceStr }}</span>
                        </p>
                    </div>
                </div>
                <div class="full-width">
                    <div class="full-width app-flex app-md-spacing">
                        <!--<MazBtn v-if="redeemIncluded.includes('drink')" size="mini">See Drink Choices</MazBtn>-->
                    </div>
                </div>
            </div>
        </div>
     
    </div>
</template>

<script>
export default {
emits:[
    'click'
],
props:[
    'image',
    'title',
    'quantity',
    'priceStr',
    'description',
    'order_addons',
    'included_items',
    'special_instruction'
],
computed:{
    cardImage(){
        let defaultImage = "";
        if(this.image === null || this.image === undefined){ return defaultImage};
        if(typeof this.image === 'object'){
            const { url } = this.image;
            if(url === undefined){ return defaultImage};
            return url 
        }else if(typeof this.image === 'string'){
            return this.image;
        }
     
    },
    redeemDescription(){
        let text = this.description || "";
        return text 
    },
    redeemAddons(){
        let addons = this.order_addons || [];
        return addons 
    },
    redeemIncluded(){
        let included = this.included_items || [];
        return included
    },
    redeemOrderInstructions(){
        let instruction = this.special_instruction || "";
        return instruction
    }
}
}
</script>

<style scoped>
.redeem-display-card{
    width:100%;
    height:24em;
    background:var(--app-prim-light);
    border:0.5px solid var(--app-platinum);
    cursor:pointer;
}

.redeem-display-img{
    width:100%;
    height:45%;
}

.redeem-display-img img{
    width:100%;
    height:100%;
    border:none;
    object-fit:cover;
}

.redeem-display-content{
    height:55%;
    width:100%;
    overflow-y:scroll;
}

.redeem-display-content::-webkit-scrollbar{
    width:4px;
}

.redeem-display-content::-webkit-scrollbar-track{
    background:var(--app-grey);
    width:4px;
}

.redeem-display-content::-webkit-scrollbar-thumb{
    width:4px;
    background:var(--app-prim-black);
    height:60px;
}

.redeem-display-content-header{
    width:100%;
    height:50px;
    background:var(--app-prim-black);
    position:sticky;
    top:0px;
    left:0px;
    display:flex;
    align-items:center;
    justify-content:space-between;
    z-index:2;
}


.redeem-heading{
    font-size:var(--app-text-lg);
    font-weight:600;
    color:var(--app-prim-light)
}

.redeem-content-text{
    font-size:var(--app-text-xs)
}


.redeem-addon-wrapper{
    width:100%;
    position:relative;
    display:flex;
    flex-direction:column;
}


.redeem-addon-item{
    width:100%;
    background:var(--app-prim-black);
    color:var(--app-prim-light);
    font-size:var(--app-text-xs);
    border-bottom:0.1px solid var(--app-prim-light)
}

.redeem-order-price{
    font-size:var(--app-text-lg);
    font-weight:600;
}
</style>