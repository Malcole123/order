<template>
    <div :class="componentClass">
        <div class="app-page-loader-container">
            <div class="app-loader-svg-wrapper">
                <div class="app-loader-cookie">
                    <svg 
                    viewbox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg" 
                    fill-rule="evenodd" clip-rule="evenodd">
                    <path 
                    d="M23.999 12.149c-.049 3.834-1.893 7.223-4.706 9.378-1.993 1.53-4.485 2.449-7.198 2.473-6.464.057-12.051-5.107-12.095-12 3.966 1.066 7.682-1.993 6-6 4.668.655 6.859-2.389 6.077-6 6.724.064 11.999 5.542 11.922 12.149zm-15.576-4.123c-.065 3.393-2.801 5.868-6.182 6.166 1.008 4.489 5.015 7.807 9.759 7.807 5.262 0 9.576-4.072 9.97-9.229.369-4.818-2.755-9.357-7.796-10.534-.277 2.908-2.381 5.357-5.751 5.79zm5.077 8.974c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm-5.5-2.853c1.104 0 2 .896 2 2s-.896 2-2 2-2-.896-2-2 .896-2 2-2zm10-2.147c1.104 0 2 .896 2 2s-.896 2-2 2-2-.896-2-2 .896-2 2-2zm-5 0c.552 0 1 .448 1 1s-.448 1-1 1-1-.448-1-1 .448-1 1-1zm2.5-5c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm-12.5 0c.552 0 1 .448 1 1s-.448 1-1 1-1-.448-1-1 .448-1 1-1zm-1.5-4c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm6-2c.828 0 1.5.672 1.5 1.5s-.672 1.5-1.5 1.5-1.5-.672-1.5-1.5.672-1.5 1.5-1.5zm-3.5-1c.552 0 1 .448 1 1s-.448 1-1 1-1-.448-1-1 .448-1 1-1z"
                    stroke-dasharray="2"
                    stroke-dashoffset="2"
                    />
                </svg>
                </div>
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

    .app-page-loader svg{
        fill:#fff!important;
        width:220px;
        height:220px;
    }

    .app-page-loader-hidden{
        display:none;
    }
</style>