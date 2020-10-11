module.exports = {
  deploy : {
    development : {
      key :  '~/.ssh/id_rsa',
      user: 'datadriven-user',
      host : 'esxvm-vcenter1-web-datadriven1.synten.com',
      ref  : 'origin/master',
      repo : 'git@github.com:DataDrivenDev/bpce.git',
      path : '/home/www/clients/www/siteCarriere/bpce',
      "pre-setup" : "rm -rf /home/www/clients/www/siteCarriere/bpce",
      "post-setup" : 'npm install && npm run build'
    }
  }
};
