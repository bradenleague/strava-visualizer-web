import { parse } from 'yaml';
import { VisualizationConfig } from './config';

/**
 * Loads a YAML configuration file and returns a VisualizationConfig object
 * 
 * @param yamlContent - The content of the YAML configuration file
 * @returns A VisualizationConfig object
 */
export function loadConfigFromYaml(yamlContent: string): Partial<VisualizationConfig> {
  try {
    const parsedConfig = parse(yamlContent) as Partial<VisualizationConfig>;
    return parsedConfig;
  } catch (error) {
    console.error('Error parsing YAML configuration:', error);
    return {};
  }
}

/**
 * Loads a YAML configuration file from a URL and returns a VisualizationConfig object
 * 
 * @param url - The URL of the YAML configuration file
 * @returns A Promise that resolves to a VisualizationConfig object
 */
export async function loadConfigFromUrl(url: string): Promise<Partial<VisualizationConfig>> {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch configuration: ${response.statusText}`);
    }
    const yamlContent = await response.text();
    return loadConfigFromYaml(yamlContent);
  } catch (error) {
    console.error('Error loading configuration from URL:', error);
    return {};
  }
}

/**
 * Loads a YAML configuration file from a local file and returns a VisualizationConfig object
 * This function is meant to be used in a Node.js environment
 * 
 * @param filePath - The path to the YAML configuration file
 * @returns A Promise that resolves to a VisualizationConfig object
 */
export async function loadConfigFromFile(filePath: string): Promise<Partial<VisualizationConfig>> {
  try {
    // This is a client-side implementation that works in the browser
    const response = await fetch(filePath);
    if (!response.ok) {
      throw new Error(`Failed to fetch configuration: ${response.statusText}`);
    }
    const yamlContent = await response.text();
    return loadConfigFromYaml(yamlContent);
  } catch (error) {
    console.error('Error loading configuration from file:', error);
    return {};
  }
} 