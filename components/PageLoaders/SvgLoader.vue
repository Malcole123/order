<template>
    <div :class="componentClass">
        <div class="app-page-loader-container">
            <div class="app-loader-svg-wrapper">
                <MazLoader
                :dark="true"
                />
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props:[
        'showLoader'
    ],
    emits:[
        'loaderShown'
    ],
    mounted(){
        this.$emit('loaderShown')
    },
    computed:{
        componentClass(){
            if(this.showLoader === true){
                return "app-page-loader"
            }else{
                return "app-page-loader app-page-loader-hidden"
            }
        }
    }
}
</script>

<style scoped>
    .app-page-loader{
        position:fixed;
        width:100%;
        height:100%;
        background:var(--app-prim-black);
        top:0%;
        left:0%;
        right:0%;
        bottom:0%;
        z-index:9999
    }

    .app-page-loader-container{
        width:100%;
        height:100%;
        position:relative;
        display:flex;
        align-items:center;
        justify-content:center;
    }

    .app-page-loader .material-icons{
        color:#fff!important;
        font-size:100px;
    }

    .app-page-loader-hidden{
        display:none;
    }
</style>