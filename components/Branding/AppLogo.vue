<template>
    <div class="app-logo" @click="$emit('click')">
        Munchies
    </div>
</template>

<script>
export default {
    emits:[
        'click'
    ]
}
</script>

<style scoped>
    .app-logo{
        text-transform:capitalize;
        font-weight:600;
        font-family:var(--app-heading-font);
        font-size:var(--app-text-xl);
        font-weight:700;
        cursor:pointer;
    }
</style>