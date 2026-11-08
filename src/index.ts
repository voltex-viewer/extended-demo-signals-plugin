import { 
    PluginContext, 
    RenderMode, 
    SignalBackend,
    SignalSource
} from '@voltex-viewer/plugin-api';
import {
    FunctionTimeSequence,
    FunctionValueSequence,
    SequenceSignal
} from '@voltex-viewer/signal-utils';
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
    const sources: SignalSource<SignalBackend>[] = [];

    // Damped Sine Wave
    const dampedSineSource: SignalSource<SignalBackend> = {
        name: ['Extended Demo', 'Damped Sine'],
        signal: () => Promise.resolve(new SequenceSignal(
            dampedSineSource,
            time,
            new FunctionValueSequence(
                (t: number) => config.amplitude * Math.exp(-t / (config.timespan * 0.3)) * Math.sin(2 * Math.PI * config.frequency * 3 * t),
                time,
                -config.amplitude,
                config.amplitude
            ),
            RenderMode.Lines,
            () => false
        )),
    };
    sources.push(dampedSineSource);

    // Chirp Signal (frequency sweep)
    const chirpSource: SignalSource<SignalBackend> = {
        name: ['Extended Demo', 'Chirp Signal'],
        signal: () => Promise.resolve(new SequenceSignal(
            chirpSource,
            time,
            new FunctionValueSequence(
                (t: number) => {
                    const f0 = config.frequency;
                    const f1 = config.frequency * 10;
                    const instantFreq = f0 + (f1 - f0) * t / config.timespan;
                    return config.amplitude * Math.sin(2 * Math.PI * instantFreq * t);
                },
                time,
                -config.amplitude,
                config.amplitude
            ),
            RenderMode.Lines,
            () => false
        )),
    };
    sources.push(chirpSource);

    // Add all signal sources
    context.signalSources.add(sources);
};