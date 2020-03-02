# shamanic

## Usage

## Developing

To install dependencies and build UI:

Install "npm package manager" for the command line

$ npm install // gets you the packages

$ npm run-script build // builds the site via webpack

Prerequisites:

[VirtualBox](https://www.virtualbox.org/wiki/Downloads)

[Vagrant](https://docs.vagrantup.com/v2/installation/)

Three files will define your dev installation:

`config/settings.js` (build yours based on `settings.shadow.js`)

`config/virtualmachine/Vagrantfile`

`config/virtualmachine/build.sh`

Specify your `path/to/shamanic/webapp` in the `Vagrantfile` and `build.sh` files.
Then, specify the `username`, `password` and `database` you want postgresql to use for your instance of pg in `settings.js`.
By default, the `username` will be `vagrant` because that's what Vagrant wants to use when it provisions a new VM. 
If you would like to change that, comment in this line in the `Vagrantfile`: `config.ssh.username = 'vagrant'`. Likewise with the password, and `config.ssh.password = 'vagrant'`.

If you want to assign different ports in the `Vagrantfile` you can do so - the host:guest pairs default to:

    postgres, 15432:5432
    ssh, 80:4567
    nodejs, 3000:3000

Then run `cd config/virtualmachine/ && vagrant up` to load and provision the VM. Then run `vagrant ssh` and you'll be in the VM - 
check that the psql instance generated and logged you in correctly by runnning `psql -d [your-database-name]` and confirming you have a prompt for psql. 
You can check your relations were generated correctly by running `\dt` at the prompt.

To enable the database backend you'll need to define this environment variable: `DATABASE_URL`. Give it whatever values are specific to your postgres installation, e.g. `postgres://[db_user]:[db_password]@127.0.0.1:5432/[db_name]`. You can set the environment variable in a terminal session or pass it in as an arg to the start command like `DATABASE_URL=[db_connection_string] npm start`.

Either way, the command to run the server is `npm start`. You're now ready to develop, debug and test your work!
