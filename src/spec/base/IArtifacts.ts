import {IEvent, IEventFallback} from './IEvent'

export interface IArtifacts {
  artifacts: Record<string, string[]> | undefined;
}

export interface IArtifactType {
  artifactType: string | undefined;
}

export type IArtifactsResolverBase = IArtifacts & IEvent & IEventFallback

export interface IArtifactsResolverOverrides {
  overrides: IArtifactsResolverBase[] | undefined;
}

export type IArtifactsResolver = IArtifactsResolverBase & IArtifactsResolverOverrides
