<template>
  <div class="col">
    <div class="card h-100">
      <img :src="imageSrc" class="card-img-top" :alt="altText">
      <div class="card-body">
        <h5 class="card-title">{{ title }}</h5>
        <p class="card-text">{{ description }}</p>
      </div>
      <div class="card-footer">
        <a :href="link" class="btn btn-primary btn-sm shadow-md">View Page</a>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    imageSrc: String,
    altText: String,
    title: String,
    description: String,
    link: String
  }
}
</script>
