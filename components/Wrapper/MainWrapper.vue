<template>
    <div class="main-wrapper">
        <slot name="navbar"></slot>
        <slot name="body"></slot>
        <slot name="footer"></slot>
    </div>
</template>

<script>
export default {

}
</script>

<style scoped>
    .main-wrapper{
        min-height:100vh;
        width:100%;
        padding-top:70px;
    }
</style>