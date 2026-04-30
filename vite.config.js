import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        ahmedabad: 'ahmedabad.html',
        betul: 'betul.html',
        booking: 'booking.html',
        chennai: 'chennai.html',
        ghaziabad: 'ghaziabad.html',
        indore: 'indore.html',
        service: 'service.html'
      }
    }
  }
})
