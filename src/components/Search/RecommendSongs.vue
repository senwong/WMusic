<template>
  <section v-if="songs && songs.length > 0" class="recommendation-section">
    <div class="title">单曲</div>
    <ul>
      <li v-for="song in songs" :key="song.id" class="list-item">
        <router-link class="item" :to="`/song/${song.id}`">
          <span class="item-title">
            {{ song.name }} -
            {{
              song.artists
                .filter(ar => ar.id != 0)
                .map(ar => ar.name)
                .join("/")
            }}
          </span>
        </router-link>
      </li>
    </ul>
  </section>
</template>

<script>
export default {};
</script>

<style></style>
