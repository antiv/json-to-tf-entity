var ghpages = require('gh-pages');

ghpages.publish(
    'public', // path to public directory
    {
        branch: 'gh-pages',
        repo: 'https://github.com/antiv/json-to-tf-entity', // Update to point to your repository  
        user: {
            name: 'Ivan Antonijevic', // update to use your name
            email: 'iantonijevic@gmial.com' // Update to use your email
        }
    },
    () => {
        console.log('Deploy Complete!')
    }
)