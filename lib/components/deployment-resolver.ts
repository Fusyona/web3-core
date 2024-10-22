import assert from "assert"
import { Address } from "../types"

// TODO: check if would be possible to use it from hardhat-inspect
export interface Deployment {
    [chainId: number]: string
}

export interface IDeploymentResolver {
    resolveDeployment(chainId: number): Address ;
} 

export class DeploymentResolver implements IDeploymentResolver {

    constructor(protected deployments: Deployment) {
        this.deployments = deployments ;
    }

    resolveDeployment(chainId: number): Address {
        const deployment = this.deployments[chainId] as Address
        assert(deployment, `No deployment in chain ${chainId}`)
        return deployment
    }

}
