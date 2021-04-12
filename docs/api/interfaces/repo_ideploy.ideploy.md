[@boxboat/dockhand-lite](../README.md) / [Modules](../modules.md) / [repo/IDeploy](../modules/repo_ideploy.md) / IDeploy

# Interface: IDeploy

[repo/IDeploy](../modules/repo_ideploy.md).IDeploy

## Hierarchy

* *IDeployBase*

  ↳ **IDeploy**

## Table of contents

### Properties

- [artifactPublishEvents](repo_ideploy.ideploy.md#artifactpublishevents)
- [artifacts](repo_ideploy.ideploy.md#artifacts)
- [deploymentMap](repo_ideploy.ideploy.md#deploymentmap)
- [name](repo_ideploy.ideploy.md#name)
- [overrides](repo_ideploy.ideploy.md#overrides)

## Properties

### artifactPublishEvents

• **artifactPublishEvents**: *undefined* \| [*IArtifactPublishEvents*](repo_icommon.iartifactpublishevents.md)[]

Inherited from: IDeployBase.artifactPublishEvents

Defined in: [repo/ICommon.ts:7](https://github.com/boxboat/dockhand-lite/blob/cfc9e3a/src/spec/repo/ICommon.ts#L7)

___

### artifacts

• **artifacts**: *undefined* \| *Record*<string, string[]\>

Inherited from: IDeployBase.artifacts

Defined in: [base/IArtifacts.ts:4](https://github.com/boxboat/dockhand-lite/blob/cfc9e3a/src/spec/base/IArtifacts.ts#L4)

___

### deploymentMap

• **deploymentMap**: *undefined* \| *Record*<string, [*IDeployment*](repo_ideploy.ideployment.md)\>

Defined in: [repo/IDeploy.ts:8](https://github.com/boxboat/dockhand-lite/blob/cfc9e3a/src/spec/repo/IDeploy.ts#L8)

___

### name

• **name**: *undefined* \| *string*

Inherited from: IDeployBase.name

Defined in: [repo/ICommon.ts:8](https://github.com/boxboat/dockhand-lite/blob/cfc9e3a/src/spec/repo/ICommon.ts#L8)

___

### overrides

• **overrides**: *undefined* \| [*IArtifactsResolverBase*](../modules/base_iartifacts.md#iartifactsresolverbase)[]

Inherited from: IDeployBase.overrides

Defined in: [base/IArtifacts.ts:14](https://github.com/boxboat/dockhand-lite/blob/cfc9e3a/src/spec/base/IArtifacts.ts#L14)
