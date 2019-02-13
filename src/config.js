const env = process.env.NODE_ENV || 'development';

const config = {
    development: {
        baseUrl: "https://rifood.herokuapp.com"
    },

    production: {
        baseUrl: "https://rifood.herokuapp.com"
    }
}

export default config[env];