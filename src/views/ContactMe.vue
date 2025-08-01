<template>
  <Layout>
    <div class="contact-container">
      <div class="container py-5">
        <h1 class="text-center mb-5">Contact Me</h1>
        
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <div class="contact-form-container">
              <form @submit.prevent="submitForm" class="contact-form">
                <div class="mb-3">
                  <label for="name" class="form-label">Name</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="name" 
                    v-model="form.name" 
                    required
                  >
                </div>
                
                <div class="mb-3">
                  <label for="email" class="form-label">Email</label>
                  <input 
                    type="email" 
                    class="form-control" 
                    id="email" 
                    v-model="form.email" 
                    required
                  >
                </div>
                
                <div class="mb-3">
                  <label for="subject" class="form-label">Subject</label>
                  <input 
                    type="text" 
                    class="form-control" 
                    id="subject" 
                    v-model="form.subject" 
                    required
                  >
                </div>
                
                <div class="mb-3">
                  <label for="message" class="form-label">Message</label>
                  <textarea 
                    class="form-control" 
                    id="message" 
                    rows="5" 
                    v-model="form.message" 
                    required
                  ></textarea>
                </div>
                
                <div class="text-center">
                  <button type="submit" class="btn btn-primary btn-lg">Send Message</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <div class="row mt-5">
          <div class="col-md-4 text-center">
            <div class="contact-info">
              <h3>Email</h3>
              <p>contact@theodoreai.com</p>
            </div>
          </div>
          <div class="col-md-4 text-center">
            <div class="contact-info">
              <h3>Phone</h3>
              <p>+1 (555) 123-4567</p>
            </div>
          </div>
          <div class="col-md-4 text-center">
            <div class="contact-info">
              <h3>Location</h3>
              <p>Portland, OR</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from '../components/Layout.vue'

export default {
  name: 'ContactMe',
  components: {
    Layout
  },
  data() {
    return {
      form: {
        name: '',
        email: '',
        subject: '',
        message: ''
      }
    }
  },
  methods: {
    submitForm() {
      // Handle form submission
      console.log('Form submitted:', this.form)
      // Add your form submission logic here
      alert('Thank you for your message! I\'ll get back to you soon.')
      this.resetForm()
    },
    resetForm() {
      this.form = {
        name: '',
        email: '',
        subject: '',
        message: ''
      }
    }
  }
}
</script>

<style scoped>
.contact-container {
  background-color: #F0FFFF;
  min-height: 100vh;
  font-family: sans-serif;
}

h1 {
  text-align: center;
  font-family: serif;
  font-weight: normal;
  text-transform: uppercase;
  border-bottom: 9px solid #57b1dc;
  margin-top: 30px;
  color: #d1633c;
}

.contact-form-container {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.contact-info {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
}

.contact-info h3 {
  color: #57b1dc;
  margin-bottom: 1rem;
}

.btn-primary {
  background-color: #57b1dc;
  border-color: #57b1dc;
}

.btn-primary:hover {
  background-color: #d1633c;
  border-color: #d1633c;
}
</style>
