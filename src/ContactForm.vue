<template>
    <div class="container">
            <notifications position="bottom right"/>
            <form ref="form" @submit.prevent="sendEmail">
                <label>Name</label>
                <input type="text" name="name" v-model="name" class="feedback-input" >
                <label>Email</label>
                <input type="email" name="email" v-model="email" class="feedback-input" >
                <label>Message</label>
                <textarea name="message" v-model="message" class="feedback-input" ></textarea>
                <input type="submit" value="Send">
            </form>
    </div>
</template>

<script>
import emailjs from 'emailjs-com';

export default {
    name: "ContactForm",
    
    data() {
        return {
            name: '',
            email: '',
            message: ''
        }
    },
    methods: {
        sendEmail() {
            if(this.name && this.email && this.message) {
                try {
                    emailjs.sendForm('service_k6m8klr', 'template_404aweh', this.$refs.form,
                                     '0SJDaSwBwKN3SxYz1');

                } catch(error) {
                    console.log({error})
                    this.$notify({
                        title: 'Error',
                        text: 'Something wrong!',
                        type: 'error',
                        duration: 5000,
                        speed: 1000,
                    });
                }
                
                this.name = '';
                this.email = '';
                this.message = '';
                
                this.$notify({
                    title: 'Success',
                    text: 'Success send Message',
                    type: 'success',
                    duration: 5000,
                    speed: 1000,
                });
            } else {
                this.$notify({
                    title: 'Warning',
                    text: 'All fields are required',
                    type: 'warn',
                    duration: 5000,
                    speed: 1000,
                });
            }
        }
    }
}
</script>

<style scoped>
form { max-width:420px; margin:50px auto; }
.feedback-input {
    color:black;
    font-weight:500;
    border-radius: 5px;
    line-height: 22px;
    background-color: transparent;
    border:2px solid black;
    transition: all 0.3s;
    padding: 13px;
    margin-bottom: 15px;
    width:100%;
    box-sizing: border-box;
    outline:0;
}

.feedback-input:focus { border:2px solid red; }

textarea {
    height: 150px;
    line-height: 150%;
    resize:vertical;
}

[type="submit"] {
    width: 100%;
    background:green;
    border-radius:5px;
    border:0;
    cursor:pointer;
    color:white;
    font-size:24px;
    padding-top:10px;
    padding-bottom:10px;
    transition: all 0.3s;
    margin-top:-4px;
    font-weight:700;
}
[type="submit"]:hover { background:blue; }
</style>