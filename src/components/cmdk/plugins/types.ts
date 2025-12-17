import type { Awaitable } from '@0x-jerry/utils'
import type { Component } from 'vue'
import type { ConfigurationItem } from '../hooks/useConfigurationManager'

export enum ExecuteMode {
  /**
   * Execute one time
   */
  OneShot,
  /**
   * Show a message in the footer section
   */
  Inline,
  /**
   * Show a markdown content in the content section
   */
  Full,
  /**
   * Takeover the content section, use a custom vue component
   */
  Takeover,
}

export interface PluginApi {
  getConfig<T>(key: string): T | undefined
  setConfig<T>(key: string, value: T): void

  logger: Console
}

interface CommonContext {
  api: PluginApi

  abortSignal: AbortSignal
}

export interface ExecuteContext extends CommonContext {
  /**
   *
   * Only available when mode is inline
   */
  input?: string

  abortSignal: AbortSignal

  /**
   * Support markdown string
   */
  print: Console['log']

  /**
   * Clear the output
   */
  clear(): void

  /**
   *
   * @param message Support markdown string
   */
  toast(message: string): void
}

export interface RuntimeContext extends CommonContext {
  abortSignal: AbortSignal
}

export interface CommandItem {
  name: string
  icon?: string

  /**
   * Default is {@link ExecuteMode.OneShot}
   */
  mode?: ExecuteMode

  execute?(ctx: ExecuteContext): Awaitable<void>

  /**
   * Available when mode is Takeover
   */
  run?(ctx: RuntimeContext): Component
}

export interface CmdkPlugin {
  name: string
  icon?: string

  // Author + Identifier should be unique string
  identifier: string
  author: string

  configuration?: ConfigurationItem[]

  commands?(): CommandItem[]
}

export type CmdkPluginFactory = CmdkPlugin | (() => CmdkPlugin | Promise<CmdkPlugin>)

export function definePlugin(factory: CmdkPluginFactory) {
  return factory
}
