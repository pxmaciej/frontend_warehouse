<template>
    <v-row>
        <v-form
                ref="form"
                v-model="valid"
                lazy-validation
        >
            <v-text-field
                    v-model="name"
                    :counter="10"
                    :rules="nameRules"
                    label="Name"
                    required
            ></v-text-field>

            <v-text-field
                    v-model="login"
                    :rules="loginRules"
                    label="Login"
                    required
            ></v-text-field>
            
            <v-text-field
                    v-model="phone"
                    :rules="phoneRules"
                    label="Phone"
                    required
            ></v-text-field>

            <v-select label="Role" v-model="role" :items="roles" />
            
            <v-text-field
                    label="Password"
                    v-model="password"
                    type="password"
                    :rules="passwordRules"
            ></v-text-field>
            
            <v-text-field
                    label="Password Confirmation"
                    v-model="password_confirmation"
                    type="password"
                    :rules="passwordRules"
            ></v-text-field>
            
            <template v-if="!isPasswordValid">
                <div class="error-message">
                    The password and password confirmation must be the same.
                </div>
            </template>
            
            <v-btn
                    :disabled="!valid"
                    color="success"
                    class="mr-4"
                    @click="validate"
            >
                Validate
            </v-btn>

            <v-btn
                    color="error"
                    class="mr-4"
                    @click="reset"
            >
                Reset Form
            </v-btn>

            <v-btn
                    color="warning"
                    @click="resetValidation"
            >
                Reset Validation
            </v-btn>
        </v-form>
    </v-row>
</template>

<script>
function validatePhoneNumber(phoneNumber) {
    if (typeof phoneNumber !== 'string') {
        return false;
    }

    // Remove all non-digit characters from the string
    const digits = phoneNumber.replace(/\D/g, '');

    // Validate the phone number using regex
    const regex =  /^(?:(?:(?:\+|00)?48)|(?:\(\+?48\)))[\s-]*(?:0[\s-]*[1-9]|[1-9][\s-]*\d)(?:[\s-]*\d[\s-]*){7}$/;
    return regex.test(digits);
}

export default {
    name: "formProfile",
    
    data: () => ({
        valid: true,
        name: '',
        nameRules: [
            v => !!v || 'Name is required',
            v => (v && v.length <= 10) || 'Name must be less than 10 characters',
        ],
        login: '',
        loginRules: [
            v => !!v || 'Login is required'
        ],
        phone: '',
        phoneRules: [
            v => validatePhoneNumber(v) || 'Invalid phone number'
        ],
        password: '',
        password_confirmation: '',
        passwordRules: [
            v => !!v || 'Password is required.'
        ],
        roles: ['user', 'admin']
    }),
    
    computed: {
        isPasswordValid() {
            return this.password === this.password_confirmation;
        }
    },
    
    methods: {
        validate() {
            this.$refs.form.validate()
                .then(valid => {
                    if (valid) {
                        // Form is valid, do something (e.g. send a request to the backend)
                    }
                })
        },
        reset() {
            this.$refs.form.reset()
        },
        resetValidation() {
            this.$refs.form.resetValidation()
        },
    },
    
}
</script>

<style scoped>

</style>