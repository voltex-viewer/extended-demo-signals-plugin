import { 
    PluginContext, 
    RenderMode, 
    SignalSource, 
    FunctionSignal, 
    FunctionTimeSequence 
} from '@voltex-viewer/plugin-api';
import * as t from 'io-ts';

// Configuration schema for the plugin
const ExtendedDemoSignalsConfigSchema = t.type({
    frequency: t.number,
    amplitude: t.number,
    timespan: t.number,
    sampleCount: t.number,
});

export default (context: PluginContext): void => {
    // Load configuration with defaults
    const config = context.loadConfig(ExtendedDemoSignalsConfigSchema, {
        frequency: 1,
        amplitude: 1,
        timespan: 1000,
        sampleCount: 1000,
    });

    const time = new FunctionTimeSequence(config.timespan, config.sampleCount);
    const sources: SignalSource[] = [];

    // Damped Sine Wave
    const dampedSineSource: SignalSource = {
        name: ['Extended Demo', 'Damped Sine'],
        signal: () => new FunctionSignal(
            dampedSineSource,
            time,
            (t: number) => config.amplitude * Math.exp(-t / (config.timespan * 0.3)) * Math.sin(2 * Math.PI * config.frequency * 3 * t),
            -config.amplitude,
            config.amplitude
        ),
        renderHint: RenderMode.Lines,
    };
    sources.push(dampedSineSource);

    // Chirp Signal (frequency sweep)
    const chirpSource: SignalSource = {
        name: ['Extended Demo', 'Chirp Signal'],
        signal: () => new FunctionSignal(
            chirpSource,
            time,
            (t: number) => {
                const f0 = config.frequency;
                const f1 = config.frequency * 10;
                const instantFreq = f0 + (f1 - f0) * t / config.timespan;
                return config.amplitude * Math.sin(2 * Math.PI * instantFreq * t);
            },
            -config.amplitude,
            config.amplitude
        ),
        renderHint: RenderMode.Lines,
    };
    sources.push(chirpSource);

    // Add all signal sources
    context.signalSources.add(...sources);
};