import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        ahmedabad: 'ahmedabad.html',
        betul: 'Betul.html',
        booking: 'Booking.html',
        chennai: 'Chennai.html',
        ghaziabad: 'Ghaziabad.html',
        indore: 'Indore.html',
        service: 'service.html'
      }
    }
  }
})