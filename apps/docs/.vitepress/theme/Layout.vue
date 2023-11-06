<script setup>
import { useData } from 'vitepress'
import NotFound from './NotFound.vue'
import Home from './Home.vue'
import Page from './Page.vue'

const { page, frontmatter } = useData()
</script>

<template>
<Home v-if="frontmatter.layout === 'home'" />
</template>

<style scoped>
</style>
