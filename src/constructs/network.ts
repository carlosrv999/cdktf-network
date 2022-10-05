import { ComputeNetwork } from "@cdktf/provider-google/lib/compute-network";
import { ComputeSubnetwork } from "@cdktf/provider-google/lib/compute-subnetwork";
import { Construct } from "constructs";

export interface IMyNetwork {
  readonly name: string;
  readonly privateSubnets?: string[];
  readonly publicSubnets?: string[];
}

export class MyNetwork extends Construct {
  network: ComputeNetwork;
  privateSubnets: ComputeSubnetwork[];
  publicSubnets: ComputeSubnetwork[] = [];

  constructor(scope: Construct, id: string, props: IMyNetwork) {
    super(scope, id);

    this.network = new ComputeNetwork(this, "Network", {
      name: props.name,
      autoCreateSubnetworks: false,
      deleteDefaultRoutesOnCreate: false,
    });

    this.privateSubnets = this.initializePrivateSubnets(props.privateSubnets);
    this.publicSubnets = this.initializePublicSubnets(props.publicSubnets);

  }

  private initializePrivateSubnets = (privateSubnets?: string[]): ComputeSubnetwork[] => {
    const subnets: ComputeSubnetwork[] = [];

    if (!privateSubnets) privateSubnets = [];

    privateSubnets.forEach((subnet, index) => {
      subnets.push(new ComputeSubnetwork(this, `subnet-private-${index + 1}`, {
        ipCidrRange: subnet,
        name: `private-${index + 1}`,
        network: this.network.id,
        privateIpGoogleAccess: true,
      }))
    });

    return subnets;
  }

  private initializePublicSubnets = (publicSubnets?: string[]): ComputeSubnetwork[] => {
    const subnets: ComputeSubnetwork[] = [];

    if (!publicSubnets) publicSubnets = [];

    publicSubnets.forEach((subnet, index) => {
      subnets.push(new ComputeSubnetwork(this, `subnet-public-${index + 1}`, {
        ipCidrRange: subnet,
        name: `public-${index + 1}`,
        network: this.network.id,
      }))
    });

    return subnets;
  }

}