import { Construct } from "constructs";
import { App, GcsBackend, TerraformStack } from "cdktf";
import { ComputeNetwork } from "@cdktf/provider-google/lib/compute-network";
import { GoogleProvider } from "@cdktf/provider-google/lib/provider";

class MyStack extends TerraformStack {
  constructor(scope: Construct, name: string) {
    super(scope, name);

    // define resources here
    new GcsBackend(this, {
      bucket: "terraform-sandbox-cramirezv",
      prefix: "terraform/state",
    });

    new GoogleProvider(this, "Google", {
      project: "sandbox-364517",
      region: "us-central1",
      zone: "us-central1-c",
    });

    new ComputeNetwork(this, "Network", {
      name: "cdktf-network",
      autoCreateSubnetworks: false,
    });
  }
}

const app = new App();
new MyStack(app, "learn-cdktf-docker");
app.synth();
