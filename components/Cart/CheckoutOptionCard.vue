<template>
    <div class="checkout-option-card component-padding" :style="compStyle">
        <div class="full-width app-flex app-flex-between-row">
            <div class="app-flex app-sm-spacing app-flex-align-center">
                <MazCheckbox :value="activeSelected" @input="emitChange"/>
                <div class="checkout-option-heading">
                {{ title }}
                </div>
            </div>
           
            <span class="checkout-change-indicator" v-if="selected && location_set">
                Change
            </span>
        </div>
        <div class="full-width">
            <slot name="option_body"></slot>
        </div>
    </div>
</template>

<script>
export default {
    emits:[
        'selectChange'
    ],
    props:[
        'title',
        'width',
        'selected',
        'index',
    ],
    data(){
        return {
            activeSelected:false,
            location_set:false,
        }
    },
    mounted(){
        this.activeSelected = this.selected || false;
    },
    watch:{
        selected(newVal,oldVal){
            this.activeSelected = newVal;
        }
    },
    computed:{
        compStyle(){
            let  width = this.width || '100%';
            return `width:${width};`
        }
    },
    methods:{
        emitChange(val){
            console.log(val)
            this.$emit('selectChange', {
                oldVal:this.selected,
                newVal:val,
                index:this.index,
            });
            this.selected = val;
        }
    }
}
</script>

<style scoped>
    .checkout-option-card{
        max-width:100%;
        min-width:50vw;
        height:fit-content;
        border:2px solid var(--app-platinum);
        background:var(--app-prim-light);
        display:flex;
        flex-direction:column;
        gap:0.5em;
        padding-top:1em;
        padding-bottom:1em;
    }

    .checkout-option-heading{
        font-size:var(--app-text-lg);
        font-weight:600;
    }


    .checkout-change-indicator{
        font-size:var(--app-text-xs);
        font-weight:600;
        cursor:pointer;
        padding:0.4em 0.6em;
        border-radius:4%;
        border:0.015em solid var(--app-platinum);
        transition:0.1s ease-in-out;
        width:fit-content;
        height:fit-content;
    }

    .checkout-change-indicator:hover{
        font-weight:700;
        border-color:var(--app-prim-black)
    }
</style>