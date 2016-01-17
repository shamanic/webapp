# ${shamanic}



## Usage



## Developing
Prerequisites:
[VirtualBox](https://www.virtualbox.org/wiki/Downloads)

[Vagrant](https://docs.vagrantup.com/v2/installation/)

Three files will define your dev installation:
`settings/settings.js` (build yours based on `settings.shadow.js`)

`devenv/Vagrantfile`

`devenv/bootstrap_node_pg.sh`

Specify your `path/to/shamanic` in the `Vagrantfile` and `bootstrap_node_pg.sh` files.
Then, specify the `username`, `password` and `database` you want postgresql to use for your instance of pg in `settings.js`.
By default, the `username` will be `vagrant` because that's what Vagrant wants to use when it provisions a new VM. If you would like to change that, comment in this line in the `Vagrantfile`: `config.ssh.username = 'vagrant'`. Same with the password, and `config.ssh.password = 'vagrant'`.

If you want to assign different ports in the `Vagrantfile` you can do so - the host:guest pairs default to:

    postgres, 15432:5432
    ssh, 80:4567
    nodejs, 3000:3000

Then run `cd devenv && vagrant up` to load and provision the VM. Then run `vagrant ssh` and you'll be in the VM - check that the psql instance generated and logged you in correctly by runnning `psql -d [your-database-name]` and confirming you have a prompt for psql.

Run the server by using `nodejs bin/www`. You're now ready to develop, debug and test your work!