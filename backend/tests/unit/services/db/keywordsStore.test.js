import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({
  existsSync: vi.fn(),
  mkdirSync: vi.fn(),
  readFileSync: vi.fn(),
  writeFileSync: vi.fn(),
  getRedisClient: vi.fn(),
}));

vi.mock("fs", () => ({
  existsSync: mocks.existsSync,
  mkdirSync: mocks.mkdirSync,
  readFileSync: mocks.readFileSync,
  writeFileSync: mocks.writeFileSync,
}));

vi.mock("../../../../src/cache/cache.js", () => ({
  getRedisClient: mocks.getRedisClient,
}));

async function importKeywordsStore() {
  return import("../../../../src/db/keywordsStore.js");
}

describe("keywordsStore", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    delete process.env.SEARCH_KEYWORDS;
    delete process.env.KEYWORDS_STORAGE_MODE;
    delete process.env.KEYWORDS_REDIS_KEY;
    delete process.env.REDIS_KEY_PREFIX;
    delete process.env.KEYWORDS_FILE_PATH;
    mocks.getRedisClient.mockResolvedValue(null);
    mocks.existsSync.mockReturnValue(false);
  });

  it("normaliza keywords removendo vazios e duplicadas", async () => {
    const { normalizeKeywords } = await importKeywordsStore();

    expect(normalizeKeywords([" Node ", "React", "Node", "", null])).toEqual([
      "Node",
      "React",
    ]);
    expect(normalizeKeywords("Node")).toBeNull();
  });

  it("carrega keywords do Redis quando existe um array salvo", async () => {
    process.env.KEYWORDS_REDIS_KEY = "custom:keywords";
    const client = {
      get: vi.fn().mockResolvedValue(JSON.stringify([" Node ", "React", "Node"])),
    };
    mocks.getRedisClient.mockResolvedValue(client);

    const { loadKeywords } = await importKeywordsStore();

    await expect(loadKeywords(["fallback"])) .resolves.toEqual(["Node", "React"]);
    expect(client.get).toHaveBeenCalledWith("custom:keywords");
  });

  it("carrega keywords do formato legado KEYWORDS vindo do Redis", async () => {
    const client = {
      get: vi.fn().mockResolvedValue(JSON.stringify({ KEYWORDS: ["Java", "Spring", "Java"] })),
    };
    mocks.getRedisClient.mockResolvedValue(client);

    const { loadKeywords } = await importKeywordsStore();

    await expect(loadKeywords(["fallback"])) .resolves.toEqual(["Java", "Spring"]);
  });

  it("faz fallback para SEARCH_KEYWORDS quando Redis não retorna valor", async () => {
    process.env.SEARCH_KEYWORDS = " Suporte, Node, Suporte ";
    const client = { get: vi.fn().mockResolvedValue(null) };
    mocks.getRedisClient.mockResolvedValue(client);

    const { loadKeywords } = await importKeywordsStore();

    await expect(loadKeywords(["fallback"])) .resolves.toEqual(["Suporte", "Node"]);
  });

  it("lê do arquivo quando env está vazio e retorna [] para JSON inválido", async () => {
    process.env.KEYWORDS_FILE_PATH = "./tmp/keywords.json";
    mocks.existsSync.mockReturnValue(true);
    mocks.readFileSync.mockReturnValueOnce(JSON.stringify({ KEYWORDS: ["QA", "QA", "Node"] }));

    const { loadKeywords } = await importKeywordsStore();

    await expect(loadKeywords(["fallback"])) .resolves.toEqual(["QA", "Node"]);
    expect(mocks.readFileSync).toHaveBeenCalledWith(expect.stringContaining("keywords.json"), "utf-8");

    mocks.readFileSync.mockReturnValueOnce("{invalid-json");
    await expect(loadKeywords(["fallback"])) .resolves.toEqual([]);
  });

  it("usa o fallback recebido quando não encontra Redis, env nem arquivo", async () => {
    const { loadKeywords } = await importKeywordsStore();

    await expect(loadKeywords([" Produto ", "Produto", "Dados "])) .resolves.toEqual([
      "Produto",
      "Dados",
    ]);
  });

  it("salva no Redis usando a chave configurada", async () => {
    process.env.REDIS_KEY_PREFIX = "vagas-full";
    const client = { set: vi.fn().mockResolvedValue("OK") };
    mocks.getRedisClient.mockResolvedValue(client);

    const { saveKeywords } = await importKeywordsStore();

    await expect(saveKeywords([" Node ", "React", "Node"])) .resolves.toEqual(["Node", "React"]);
    expect(client.set).toHaveBeenCalledWith("vagas-full:keywords", JSON.stringify(["Node", "React"]));
  });

  it("salva em SEARCH_KEYWORDS quando está em modo env e não há Redis", async () => {
    process.env.KEYWORDS_STORAGE_MODE = "env";

    const { saveKeywords } = await importKeywordsStore();

    await expect(saveKeywords(["Backend", "Java", "Backend"])) .resolves.toEqual(["Backend", "Java"]);
    expect(process.env.SEARCH_KEYWORDS).toBe("Backend,Java");
    await expect(saveKeywords("invalido")).resolves.toBeNull();
  });

  it("salva em arquivo quando está em modo file e não há Redis", async () => {
    process.env.KEYWORDS_STORAGE_MODE = "file";
    process.env.KEYWORDS_FILE_PATH = "./tmp/file-keywords.json";

    const { saveKeywords } = await importKeywordsStore();

    await expect(saveKeywords(["SRE", "Platform"])) .resolves.toEqual(["SRE", "Platform"]);
    expect(mocks.mkdirSync).toHaveBeenCalledWith(expect.stringContaining("tmp"), { recursive: true });
    expect(mocks.writeFileSync).toHaveBeenCalledWith(
      expect.stringContaining("file-keywords.json"),
      JSON.stringify({ KEYWORDS: ["SRE", "Platform"] }, null, 2),
      "utf-8",
    );
  });
});