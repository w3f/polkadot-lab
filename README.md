[![CircleCI](https://circleci.com/gh/w3f/polkadot-lab.svg?style=svg)](https://circleci.com/gh/w3f/polkadot-lab)

# polkadot-lab

polkadot-lab is a testing framework for substrate-based chains. You can learn
more about substrate and Polkadot [here](https://wiki.polkadot.network/).

## Goals

This project aims to:

* Allow to declaratively define tests.
* Define all the conditions of the tests, don't depend on external conditions.
* Define the topology of the network: how many nodes it is composed of and how
they are connected.
* Specify the flags and the software run by each node, this will allow testing
adversarial models.
* Define the workloads to run: for example, a set of transactions to send.
* Define the network conditions, including potential injected failures: loss of
connectivity, latency, etc.
* Configure the results format: which values we want in the output and how to
return them.
* Be easily integrated on CI pipelines
* Run regularly to produce a set of reports, for instance: simple balance transfers
tx/s, the propagation speed of messages through a network with radius 100, etc.

## Quick start

You only need to have NodeJS, yarn and docker installed.

```
$ git clone git@github.com:w3f/polkadot-lab.git
$ cd polkadot-lab
$ cp config/main.sample.yaml config/main.yaml
$ yarn
$ yarn start
```
This will execute an experiment running on a Polkadot v0.8.23 network composed
of 4 nodes and with two test cases:
* average number of peers
* average time to finality
You can check the results on the `./polkadot-lab.output` file

## Architecture

From a high level point of view, polkadot-lab is a system that allows to run
experiments on networks and retrieve results from them. There are no restrictions
in terms of how the experiment should look like or which data should we obtain
from them, only some conventions that define how each component comunicates with
each other.

### Components

* Engine: this is the main component, it receives experiment requests from end-users
and orchestrates the rest of components to produce results.

* Platform: this component manages the set of IT resources (virtual machines, network
facilities, disks, etc.) on which the experiments run. polkadot-lab uses
Kubernetes as the common platform layer for all the experiments.

* Applications: all the software elements that are deployed in the platform,
including Polkadot nodes, metrics gathering applications (prometheus and
substrate-telemetry among others) and applications for defining the network
topology and conditions and the experiment's test cases. All the applications
are packaged as Helm charts.

* Test cases: they are pieces of code that are executed in the same cluster as
the network nodes and execute arbitrary actions (from scraping metrics endpoints
to trigger runtime upgrades). Their lifecycle is managed by the Results component
that runs outside the cluster and ultimately receives the result data from each
test case.

* Results: there's a separated component that handles the lifecycle of each test
case, triggering the execution and retrieving results from them. There's a simple
protocol that defines how the Results component and the test-cases should
communicate with each other using a websockets connection.

* Persistence: its purpose is storing requests and related results for later use.

### Experiments

An experiment is a declarative definition of a complete polkadot-lab execution,
including the network details and the test cases to run on it. It is composed of
the following fields:

* `name`: experiment identifier.
* `logLevel`: desired verbosity in logs, allowed values are `error`, `warning`,
`info` and `debug`.
* `maximumExecutionTime`: time limit for the experiment in seconds.
* `mode`: either `local` or `remote` executions.
* `size`: number of nodes that will form the Substrate network. Each of them
will be a validator in the testnet.
* `topology`: how are the nodes connected, the values supported currently are
`line` (nodes connected forming a line), `circle` (nodes connecteed forming a
circle) and `full` (all nodes connected with each other).
* `dependencies`: array with settings for additional apps to install, each of them
has these fields:
  * `chart`: name of the chart to install.
  * `version`: version of the chart, if not present installs the latest version.
  * `values`: values to set specific options in the chart.
* `testCases`: array of tests to execute, each of them composed of:
  * `name`: test case identifier.
  * `dependency`: same as each of the elements in the `dependencies` field above.
  * `delay`: number of seconds to wait before starting the test case.
* `persistence`: defines how to store experiment requests and results. Currently
only local file persistence is implemented, and has this fields:
  * `kind`: currently only `file`.
  * `path`: path to the file to store the results.
* `settlementTime`: number of seconds to wait before starting the tests when the
network has been created.

You can check a complete example configuration [here](./e2e-test/lab.ts#L12-#L61)

#### Test cases

TODO

### Data structures

TODO

### Remote Execution

We use terraform modules for creating the infrastructure required for remote
executions. You should have cloud provider credentials loaded so that terraform
can work, currently only GCP is supported see [here](https://www.terraform.io/docs/providers/google/guides/getting_started.html#adding-credentials) for details about the
general configuration. Your service account should have at least `Kubernetes
Engine Admin` role, see [here](https://cloud.google.com/iam/docs/granting-changing-revoking-access) for information about how to grant this permission.

### Workflow

TODO
