import { Construct } from "constructs";
import { App, GcsBackend, TerraformStack } from "cdktf";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";
import { MyNetwork } from "./src/constructs/network";

class NetworkStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    // define resources here
    new GcsBackend(this, {
      bucket: "terraform-sandbox-cramirezv",
      prefix: "terraform/state",
    });

    new GoogleProvider(this, "Google", {
      project: "sandbox-364517",
      region: "us-east1",
      zone: "us-east1-c",
    });

    new MyNetwork(this, "network", {
      name: "network-carlosrv",
      privateSubnets: [
        "10.0.0.0/24",
        "10.0.1.0/24",
        "10.0.2.0/24",
      ],
      publicSubnets: [
        "10.10.0.0/24",
        "10.10.1.0/24",
        "10.10.2.0/24",
      ]
    })
  }
}

const app = new App();
new NetworkStack(app, "cdktf-gcp");
app.synth();
