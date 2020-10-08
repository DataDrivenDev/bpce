module.exports = {

  apps : [{
    script: './pages/index.tsx',
    watch: '.',
    environement: {
      NODE_ENV: "development",
    }
  },{
    script: './service-worker/',
    watch: ['./service-worker']
  }],

  deploy : {
    production : {
      key :  '~/.ssh/id_rsa',
      user: 'datadriven-user',
      host : 'esxvm-vcenter1-web-datadriven1.synten.com',
      ref  : 'origin/bpce',
      repo : 'git@github.com:DataDrivenDev/DashRecruteur.git',
      path : '/home/www/dev/www/siteCarriere/bpce',
      "pre-setup" : "rm -rf /home/www/dev/www/siteCarriere/bpce",
      "post-setup" : 'npm install && npm build',
      env  : {
        "NODE_ENV": "development"
      }
    }
  }
};
