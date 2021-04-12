[@boxboat/dockhand-lite](../README.md) / [Modules](../modules.md) / [repo/IDeploy](../modules/repo_ideploy.md) / IDeployment

# Interface: IDeployment

[repo/IDeploy](../modules/repo_ideploy.md).IDeployment

## Hierarchy

* *IDeploymentBase*

  ↳ **IDeployment**

## Table of contents

### Properties

- [artifacts](repo_ideploy.ideployment.md#artifacts)
- [environmentKey](repo_ideploy.ideployment.md#environmentkey)
- [event](repo_ideploy.ideployment.md#event)
- [eventFallback](repo_ideploy.ideployment.md#eventfallback)
- [eventRegex](repo_ideploy.ideployment.md#eventregex)
- [group](repo_ideploy.ideployment.md#group)
- [overrides](repo_ideploy.ideployment.md#overrides)

## Properties

### artifacts

• **artifacts**: *undefined* \| *Record*<string, string[]\>

Inherited from: IDeploymentBase.artifacts

Defined in: [base/IArtifacts.ts:4](https://github.com/boxboat/dockhand-lite/blob/cfc9e3a/src/spec/base/IArtifacts.ts#L4)

___

### environmentKey

• **environmentKey**: *undefined* \| *string*

Defined in: [repo/IDeploy.ts:14](https://github.com/boxboat/dockhand-lite/blob/cfc9e3a/src/spec/repo/IDeploy.ts#L14)

___

### event

• **event**: *undefined* \| *string*

Inherited from: IDeploymentBase.event

Defined in: [base/IEvent.ts:2](https://github.com/boxboat/dockhand-lite/blob/cfc9e3a/src/spec/base/IEvent.ts#L2)

___

### eventFallback

• **eventFallback**: *undefined* \| *string*

Inherited from: IDeploymentBase.eventFallback

Defined in: [base/IEvent.ts:6](https://github.com/boxboat/dockhand-lite/blob/cfc9e3a/src/spec/base/IEvent.ts#L6)

___

### eventRegex

• **eventRegex**: *undefined* \| *string*

Inherited from: IDeploymentBase.eventRegex

Defined in: [base/IEvent.ts:10](https://github.com/boxboat/dockhand-lite/blob/cfc9e3a/src/spec/base/IEvent.ts#L10)

___

### group

• **group**: *undefined* \| *string*

Defined in: [repo/IDeploy.ts:15](https://github.com/boxboat/dockhand-lite/blob/cfc9e3a/src/spec/repo/IDeploy.ts#L15)

___

### overrides

• **overrides**: *undefined* \| [*IArtifactsResolverBase*](../modules/base_iartifacts.md#iartifactsresolverbase)[]

Inherited from: IDeploymentBase.overrides

Defined in: [base/IArtifacts.ts:14](https://github.com/boxboat/dockhand-lite/blob/cfc9e3a/src/spec/base/IArtifacts.ts#L14)
